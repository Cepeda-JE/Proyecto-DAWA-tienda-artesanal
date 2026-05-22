
import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, computed, Input, input, OnChanges, SimpleChanges, TemplateRef, viewChild, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

type DataAccessor<T> = (data: T, sortHeaderId: string) => string | number;

@Component({
  selector: 'app-ui-table',
  imports: [MatTableModule, MatPaginator, NgTemplateOutlet,MatSortModule],
  templateUrl: './ui-table.html',
  styleUrl: './ui-table.css',
})

export class UiTable<T> implements OnChanges, AfterViewInit {
  displayedColumns= computed(() => this.columns().map(col => col.def));
  dataSource = new MatTableDataSource<T>([]);
  data = input<T[]>([]);
  columns = input<tableColumn<T>[]>([]);
  isloading = input(false);
  matSort = viewChild.required(MatSort);
  sortingDataAccessor = input<DataAccessor<T>>();

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['data']?.currentValue){
      this.setData();
    }
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private setData() {
    this.dataSource.data = this.data();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort();
    if(this.sortingDataAccessor() !== undefined){
      this.dataSource.sortingDataAccessor = this.sortingDataAccessor() as (DataAccessor<T>);
    }
  }
}

export interface tableColumn<T>{
  label: string;
  def: string;
  content?: (row: T) => string | null | undefined;
  template?: TemplateRef<unknown>;
  isSortable?: boolean;
}

