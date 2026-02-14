import iziToast from "izitoast"

iziToast.settings({
    timeout: 3000,
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