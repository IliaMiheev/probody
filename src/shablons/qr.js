export default `def qr_detection(data):
    cv_image = bridge.imgmsg_to_cv2(data, 'bgr8')
    barcodes = pyzbar.decode(cv_image)
    
    if barcodes:
        qr_data = barcodes[0].data.decode('utf-8')
        return qr_data

<<separator>>
    qr_sub = rospy.Subscriber('main_camera/image_raw', Image, qr_detection, queue_size=1)
    rospy.sleep(2)
    qr_sub.unregister()`