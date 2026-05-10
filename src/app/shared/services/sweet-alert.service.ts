import {Injectable} from "@angular/core";
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {
  constructor() { }

  confirmAndDeleteWithValue(value?: string) {
    return Swal.fire({
      title: '¿Estas seguro de eliminar ' + (value === undefined ? 'este registro' : 'los datos de ' + value) + '?',
      text: "Esta acción no se podra revertir.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, Eliminalo!',
      cancelButtonText: 'No, cancelalo',
    });
  }

  deleted() {
    return Swal.fire('¡Eliminado!',
      'El registro ha sido eliminado.',
      'success');
  }

  saved(message?: string) {
    return Swal.fire({
      icon: 'success',
      title: 'Guardado',
      text: message || 'Los cambios se han guardado correctamente.'
    });
  }

  hasServerError(value?: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: value || 'No se pudo ejecutar la operación',
      footer: ''
    })
  }

  hasPermissionError(value?: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: value || 'No cuenta con permisos para acceder a este recurso.',
      footer: ''
    })
  }

  hasNotFoundError(value?: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: value || 'Recurso no encontrado.',
      footer: ''
    })
  }

  hasTimeoutError(value?: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: value || 'Tiempo de respuesta del servidor excedido.',
      footer: ''
    })
  }

}
