qr_data=''

def qr_detection(data):
    '''сканирование qr кода'''
    global qr_data
    if qr_data!= '':
        return
    cv_image = bridge.imgmsg_to_cv2(data, 'bgr8')
    barcodes = pyzbar.decode(cv_image)

    if barcodes:
        qr_data = barcodes[0].data.decode('utf-8')

    return qr_data
    



#в MAIN для вызова функции необходимо следующее:
#1. создаём и вызываем подписчика, который вызывает функцию чтения кьюаркода
qr_sub = rospy.Subscriber('main_camera/image_raw',Image, qr_detection,queue_size=1)
#2. задаём время работы подписчика (за 1 секунду примерно 20 раз вызывается функция) 
rospy.sleep(2) 
#3. выключаем подписчика
qr_sub.unregister() 

