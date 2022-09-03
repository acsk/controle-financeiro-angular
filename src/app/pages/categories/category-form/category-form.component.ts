import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import { Category } from '../shared/category.model';

import { CategoryService } from '../shared/category.service';





@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {

  currentAction?: string
  categoryForm!: FormGroup

  pageTitle: string | undefined
  serverErrorMessages?: string[] 
  submitingForm: boolean = false
  category: Category = new Category()


  constructor
    (
      private categoryService: CategoryService,
      private route: ActivatedRoute,
      private formBuilder: FormBuilder,
      private router: Router,
      private toastr: ToastrService     

    ) { }

  ngOnInit() {
    
    this.setCurrentAction()
    this.buildCategoryForm()
    this.loadCategory()

  }

  ngAfterContentChecked(): void {

    this.setPageTitle()

  }

  submitForm() {
    if (this.categoryForm.valid) {
      this.submitingForm = true
      if (this.currentAction == 'edit') {
        this.updateCategory()
      } else {
        this.createCategory()
      }
    }

  }
  private updateCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.update(category).subscribe(
      category => this.actionsForSuccess(category),
      error => this.actionForErrors(error)
    )
  }

  private createCategory() {

    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.create(category).subscribe(
      category => this.actionsForSuccess(category),
      error => this.actionForErrors(error)
    )
  }

  private actionForErrors(error:any) {
    this.toastr.error('Algum erro ocorreu!')
    this.submitingForm = false
    
    if(error.status == 422){
      this.serverErrorMessages  = JSON.parse(error._body).errors
    }else{
      this.serverErrorMessages  = ['Falha da comunicação com o servidor']
    }
  }
  private actionsForSuccess(category: Category) {
    this.toastr.success('Requisição atualizada com sucesso')
    return this.router.navigateByUrl('categories', { skipLocationChange: true }).then(
      () => this.router.navigate(['categories', category.id, 'edit'])
    )
  }

  private setPageTitle() {
    if (this.currentAction == 'new') {
      this.pageTitle = 'Cadastro de nova categoria'
    } else {
      const categoryName = this.category.name || ''
      this.pageTitle = 'Editando a categoria ' + categoryName
    }
  }

  buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      description: [null],
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
  loadCategory() {
    if (this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(Number(params.get('id'))))
      )
        .subscribe((category) => {
          this.category = category;
          this.categoryForm?.patchValue(category)
        }, (error) => this.toastr.warning('Ocorreu um erro na requisição da categoria')
        )
    }
  }
  
}
