import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

declare const bootstrap: any;

@Component({
  selector: 'app-dialogo-confirmacion',
  imports: [],
  templateUrl: './dialogo-confirmacion.html',
  styleUrl: './dialogo-confirmacion.css'
})
export class DialogoConfirmacion {

  @Input() titulo: string = '¿Estás seguro?';
  @Input() mensaje: string = '¿Deseas realizar esta acción?';
  @Input() textoBtnConfirmar: string = 'Confirmar';
  @Input() textoBtnCancelar: string = 'Cancelar';

  // Evento 
  @Output() confirmado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  @ViewChild('dialogoRef') modalElement!: ElementRef;
  modalRef: any;

  ngAfterViewInit(): void {
    this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  abrir(): void {
    this.modalRef.show();
  }

  onConfirmar(): void {
    this.modalRef.hide();
    this.confirmado.emit();
  }

  onCancelar(): void {
    this.modalRef.hide();
    this.cancelado.emit();
  }
}