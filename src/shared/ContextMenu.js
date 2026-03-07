import ContextMenu from "@imengyu/vue3-context-menu";

export default function onContextMenu(e, item) {
    ContextMenu.showContextMenu({
        theme: 'mac dark',
        x: e.x,
        y: e.y,
        items: [
            {
                label: "Платформы",
                children: [
                    {
                        label: "Белая",
                        onClick: () => createPlatform(item, 'white'),
                    },
                    {
                        label: "Синяя",
                        onClick: () => createPlatform(item, 'blue'),
                    },
                    {
                        label: "Красная",
                        onClick: () => createPlatform(item, 'red'),
                    },
                    {
                        label: "Удалить",
                        onClick: () => deletePlatform(item),
                    },
                ]
            },
            {
                label: "QR код",
                children: [
                    {
                        label: "Добавить",
                        onClick: () => alert('Здесь ещё предстоит написать код')
                    },
                    {
                        label: "Удалить",
                        onClick: () => alert('Здесь ещё предстоит написать код')
                    },
                ],
            },
            {
                label: "Отмена",
                onClick: () => {
                    alert('Здесь ещё предстоит написать код')
                }
            },
        ]
    });
}