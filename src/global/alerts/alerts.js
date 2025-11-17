import { watch } from 'vue';
import Swal from 'sweetalert2'

const alertaConBotonesBootstrap = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-primary m-1',
        cancelButton: 'btn btn-danger m-1'
    },
    buttonsStyling: false
});

export const confirmarOCancelar = async (titulo, texto, icono) => {
    return new Promise((resolve) => {
        alertaConBotonesBootstrap.fire({
            title: titulo,
            html: texto,
            icon: icono,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

export const alertaConSpinner = (titulo, text, icon) => {
    Swal.fire({
        title: titulo,
        text: text,
        icon: icon,
        allowOutsideClick: false
    });
    Swal.showLoading();
}

export const alertaSinSpinner = (titulo) => {
    return Swal.fire({
        title: titulo,
        allowOutsideClick: false,
        icon: 'success',
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
    })
}

export const alertaFallida = (mensaje, titulo, html) => {
    return Swal.fire({
        title: titulo,
        text: mensaje,
        html: html,
        allowOutsideClick: false,
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
    });
}
export const alertaNoEncontrado = (mensaje, titulo) => {
    return Swal.fire({
        title: titulo,
        text: mensaje,
        allowOutsideClick: false,
        icon: 'warning',
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
    });
}

export const cierraAlertas = () => {
    Swal.close();
}

export const alertaCarga = (valor, titulo, immediate) => {
    if (titulo == null) titulo = 'Cargando...';
    if (immediate == null) immediate = false;

    watch(valor, () => {
        if (valor.value) {
            alertaConSpinner(titulo);
        } else {
            cierraAlertas();
        }
    }, {
        immediate
    });
}