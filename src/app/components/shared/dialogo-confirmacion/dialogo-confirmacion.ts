import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

declare const bootstrap: any;

@Component({
  selector: 'app-dialogo-confirmacion',
  imports: [],
  templateUrl: './dialogo-confirmacion.html',
  styleUrl: './dialogo-confirmacion.css'
})
export class DialogoConfirmacion {

  // Textos personalizables desde el padre
  @Input() titulo: string = '¿Estás seguro?';
  @Input() mensaje: string = '¿Deseas realizar esta acción?';
  @Input() textoBtnConfirmar: string = 'Confirmar';
  @Input() textoBtnCancelar: string = 'Cancelar';

  // Evento que avisa al padre si confirmó o canceló
  @Output() confirmado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  @ViewChild('dialogoRef') modalElement!: ElementRef;
  modalRef: any;

  ngAfterViewInit(): void {
    this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  // El padre llama este método para abrir el diálogo
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