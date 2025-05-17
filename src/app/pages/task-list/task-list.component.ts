import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-task-list',
  imports: [],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {

  @ViewChild('taskModalRef') modalRef!: ElementRef;
  ngOnInit(): void {
    const modalEl = document.getElementById('taskModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
    }
  }

  closeModal() {
    const modal = bootstrap.Modal.getInstance(this.modalRef.nativeElement);
    modal?.hide();
  }
}
