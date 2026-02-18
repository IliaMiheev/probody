import copy from 'copy-to-clipboard';
import iziToast from '@/iziToast.js';

function copyToclipboard(text) {
    try {
        copy(text)
    } catch (error) {
        console.error("Ошибка при копировании текста: ", error);
        iziToast.error({
            title: 'Ошибка',
            message: "Ошибка при копировании текста. Подробности смотри в консоли",
        });
        return;
    }
}

export default copyToclipboard