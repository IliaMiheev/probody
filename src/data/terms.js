const rawTerms = [
    {
        title: 'ROS',
        body: 'ROS (Robot Operating System) — экосистема для программирования роботов. В приложении через ROS дрон получает команды, передает телеметрию и данные с камеры.',
        hrefToDoc: 'https://www.ros.org/',
        hrefToCourse: 'https://stepik.org/lesson/2260739/step/1?unit=2294748',
    },
    {
        title: 'OpenCV',
        body: 'OpenCV (Open Source Computer Vision Library) — библиотека компьютерного зрения. С её помощью дрон распознает цвета платформ и считывает QR-коды.',
        hrefToDoc: 'https://opencv.org/',
        hrefToCourse: 'https://stepik.org/lesson/2272700/step/1?unit=2306893',
    },
    {
        title: 'navigate_wait',
        body: 'Navigate_wait — функция из библиотеки Clover. Отправляет дрон в точку и ждёт, пока он туда долетит, и только потом выполняет следующую команду. Это важно, потому что обычная команда navigate не ждет: дрон ещё летит, а скрипт уже бежит дальше — из-за этого следующие команды могут выполняться раньше времени.',
        hrefToDoc: 'https://clover.coex.tech/ru/snippets.html',
        hrefToCourse: 'https://stepik.org/lesson/2264712/step/1?unit=2298803',
    },
    {
        title: 'Нода (Node)',
        body: 'Нода (Node/узел) в ROS - исполняемая программа, которая выполняет одну конкретную задачу. В сгенерированном коде вся логика полета и обработки камеры находится внутри одной ноды. Это позволяет запускать, останавливать и отлаживать программу как единое целое. ',
        hrefToDoc: 'https://docs.voltbro.ru/starting-ros/basics.html',
        hrefToCourse: 'https://stepik.org/lesson/2261765/step/1?unit=2295758',
    },
    {
        title: 'Топик (Topic)',
        body: 'Топик (Topic) в ROS — канал обмена данными. Например, камера публикует изображение в топик, а ваш скрипт подписывается на него и получает кадры.',
        hrefToDoc: 'https://docs.voltbro.ru/starting-ros/basics.html',
        hrefToCourse: 'https://stepik.org/lesson/2262844/step/1?unit=2296866',
    },
    {
        title: 'Издатель (Publisher)',
        body: 'Издатель (Publisher) в ROS — часть программы, которая отправляет данные в топик. Например, если нужно передать команду другому узлу или опубликовать координаты дрона — создается издатель, который публикует сообщения в нужный канал. Подписчики других узлов могут эти данные получать. ',
        hrefToDoc: 'https://docs.voltbro.ru/starting-ros/basics.html',
        hrefToCourse: 'https://stepik.org/lesson/2262844/step/1?unit=2296866',
    },
    {
        title: 'Подписчик (Subscriber)',
        body: 'Подписчик (Subscriber) в ROS — часть программы, которая получает данные из топика. Например, чтобы дрон "видел" изображение с камеры или считывал свои координаты, создаётся подписчик на соответствующий топик. Как только в топике появляются новые данные, подписчик автоматически их обрабатывает.',
        hrefToDoc: 'https://docs.voltbro.ru/starting-ros/basics.html',
        hrefToCourse: 'https://stepik.org/lesson/2262844/step/1?unit=2296866',
    },
    {
        title: 'Сервис',
        body: 'Сервис в ROS - способ вызвать функцию робота и сразу получить ответ. В отличие от топика, где данные идут постоянно, сервис работает по принципу "запрос — ответ". Например, команда navigate — это сервис: вы отправляете координаты, а робот отвечает "команда принята". Команда get_telemetry возвращает текущие координаты дрона.',
        hrefToDoc: 'https://docs.voltbro.ru/starting-ros/basics.html',
        hrefToCourse: 'https://stepik.org/lesson/2263182/step/1?unit=2297206',
    },
    {
        title: 'Системы координат',
        body: 'Определяют, откуда отсчитывать координаты дрона. body — относительно самого дрона (вперед/назад/влево/вправо). aruco_map — относительно карты с ArUco-метками, где координаты привязаны к неподвижным маркерам. Выбор правильной системы координат позволяет дрону точно выполнять команды: лететь относительно себя для коротких маневров или по глобальной карте для точной навигации.',
        hrefToCourse: 'https://stepik.org/lesson/2264336/step/1?unit=2298407',
        hrefToDoc: 'https://clover.coex.tech/ru/frames.html',
    },
    {
        title: 'ArUco-маркер',
        body: 'ArUco-маркер — квадратный визуальный маркер, который камера дрона может распознавать. Используется для навигации: по положению маркера дрон определяет свои координаты в пространстве.',
        hrefToCourse: 'https://stepik.org/lesson/2264336/step/1?unit=2298407',
        hrefToDoc: 'https://klever-doc.tech/ROS1/ru/aruco.html',
    },
    {
        title: 'Симулятор (Gazebo)',
        body: 'Симулятор (Gazebo) — виртуальная среда, где дрон ведет себя как в реальности. Позволяет безопасно тестировать полетные задания перед запуском на реальном дроне.',
        hrefToCourse: 'https://stepik.org/lesson/2278310/step/1?unit=2312564',
        hrefToDoc: 'https://klever-doc.tech/ROS1/ru/simulation.html',
    },
    {
        title: 'unregister()',
        body: 'unregister() — метод, который отключает подписчика от топика. Используется, чтобы перестать получать данные, когда они больше не нужны (например, после сканирования QR-кода).',
        hrefToCourse: 'https://stepik.org/lesson/2272845/step/1?unit=2307058',
        hrefToDoc: 'https://docs.ros.org/en/diamondback/api/rospy/html/rospy.topics.Subscriber-class.html',
    },
]

function toSubtitle(text) {
    if (!text) return ''
    return text.length > 72 ? `${text.slice(0, 72)}…` : text
}

export default rawTerms.map((item, index) => ({
    id: index + 1,
    title: item.title,
    subtitle: toSubtitle(item.body),
    image: '',
    description: item.body,
    hrefToDoc: item.hrefToDoc ?? null,
    hrefToCourse: item.hrefToCourse ?? null,
}))
