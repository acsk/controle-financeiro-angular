import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';
import { Entry } from '../shared/entry.model';

import { EntryService } from '../shared/entry.service';



@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit {

  currentAction?: string
  entryForm!: FormGroup

  pageTitle: string | undefined
  serverErrorMessages?: string[]
  submitingForm: boolean = false
  entry: Entry = new Entry()

  categories?: Array<Category>

  imaskConfig = {
    mask: Number,  // enable number mask
    scale: 2,  // digits after point, 0 for integers
    thousandsSeparator: '',
    padFractionalZeros: true,
    radix: ',',
    normalizeZeros: true,
  }


  constructor
    (
      private entryService: EntryService,
      private route: ActivatedRoute,
      private formBuilder: FormBuilder,
      private router: Router,
      private toastr: ToastrService,
      private categoryService: CategoryService

    ) { }

  ngOnInit() {
    this.setCurrentAction()
    this.buildEntryForm()
    this.loadEntry()
    this.loadCategories()
  }

  ngAfterContentChecked(): void {
    this.setPageTitle()
  }

  submitForm() {
    if (this.entryForm.valid) {
      this.submitingForm = true
      if (this.currentAction == 'edit') {
        this.updateEntry()
      } else {
        this.createEntry()
      }
    }

  }
  private updateEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.update(entry).subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionForErrors(error)
    )
  }

  get typesOptions(): Array<any> {
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    )
  }

  private createEntry() {

    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.create(entry).subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionForErrors(error)
    )
  }

  private actionForErrors(error: any) {
    this.toastr.error('Algum erro ocorreu!')
    this.submitingForm = false

    if (error.status == 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors
    } else {
      this.serverErrorMessages = ['Falha da comunicação com o servidor']
    }
  }
  private actionsForSuccess(entry: Entry) {
    this.toastr.success('Requisição atualizada com sucesso')
    return this.router.navigateByUrl('entries', { skipLocationChange: true }).then(
      () => this.router.navigate(['entries', entry.id, 'edit'])
    )
  }

  private setPageTitle() {
    if (this.currentAction == 'new') {
      this.pageTitle = 'Cadastro de nova lançamento'
    } else {
      const entryName = this.entry.name || ''
      this.pageTitle = 'Editando a lançamento ' + entryName
    }
  }

  buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      description: [null],
      type: ["expense", [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]]
    })
  }
  setCurrentAction() {
    if (this.route.snapshot.url[0].path == 'new') {
      this.currentAction = 'new'
    } else {
      this.currentAction = 'edit'
    }
    console.log("setCurrentAction", this.currentAction)
  }
  loadEntry() {
    if (this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(Number(params.get('id'))))
      )
        .subscribe((entry) => {
          this.entry = entry;
          this.entryForm?.patchValue(entry)
        }, (error) => this.toastr.warning('Ocorreu um erro na requisição da lançamento')
        )
    }
  }

  private loadCategories(){
    return this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    )
  }

}
