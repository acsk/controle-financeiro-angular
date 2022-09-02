import { Component, OnInit } from '@angular/core';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = []

  constructor( private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories      
    )
  }

  deleteCategory(category:any){
    const dados = JSON.stringify(category);
    const mustDelete = confirm('Dejeja deletar a categoria: ' + dados)
    
    if(mustDelete)
    this.categoryService.delete(category.id).subscribe(
      ()=>this.categories = this.categories.filter(item => item != category),
      () => alert('Erro ao tentar excluir')
    )
  }

}
