import iziToast from 'iziToast';

iziToast.settings({
    timeout: 2500,
    closeOnEscape: true,
    closeOnClick : true,
    resetOnHover: false,
    maxWidth: "400px",
    displayMode: "replace",
    position: 'topRight',
    transitionIn: 'flipInX',
    transitionOut: 'flipOutX',
});

export default iziToast