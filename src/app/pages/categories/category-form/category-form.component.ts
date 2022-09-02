import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  categoryForm?: FormGroup
  pageTitle?: string
  sereverErrorMessages: string[] = []
  submitForm: boolean = false
  category: Category = new Category()

  constructor
    (
      private categoryService: CategoryService,
      private route: ActivatedRoute,
      private formBuilder: FormBuilder,
      private router: Router,
      private toastr: ToastrService

    ) { }

  ngOnInit(): void {
    this.setCurrentAction()
    this.buildCategoryForm()
    this.loadCategory()
  }
  ngAfterContentChecked() {
   this.setPageTitle()
  }
  setPageTitle() {
    if(this.currentAction == 'new'){
      this.pageTitle == 'Cadastro de nova categoria'
    }else{
      const categoryName  = this.category.name || ''
      this.pageTitle == 'Editando a categoria' + categoryName
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
  }
  loadCategory() {
    if (this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(Number(params.get('id'))))
       )
       .subscribe((category) => {
         this.category = category;
         this.categoryForm?.patchValue(category)
        },(error) => this.toastr.warning('Ocorreu um erro na requisição da categoria')
        )
    }
  }
}
