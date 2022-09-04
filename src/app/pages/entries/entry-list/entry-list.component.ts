import { Component, OnInit } from '@angular/core';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  entries: Entry[] = []

  constructor(
    private entryService: EntryService       
  ) { }

  ngOnInit(): void {
    
    this.entryService.getAll().subscribe(
      entries => this.entries = entries
    )
    
  }

  deleteEntry(entry: any) {
    const dados = JSON.stringify(entry);
    const mustDelete = confirm('Dejeja deletar a categoria: ' + dados)

    if (mustDelete)
      this.entryService.delete(entry.id).subscribe(
        () => this.entries = this.entries.filter(item => item != entry),
        () => alert('Erro ao tentar excluir')
      )
  }
  

}
