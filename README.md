# SYNC TIKI LAZADA 

## Chức năng chính
-   Đồng bộ sản phẩm từ tiki sang lazada

## Thuật toán lặp
### Ý tưởng
 -  Duyệt mảng sử dụng sắp xếp ưu tiên để các sản phẩm có số lượng ít sẽ được kiểm tra liên tục. Độ ưu tiên sẽ giảm dần qua mỗi lần lặp để tránh bị trì hoãn vô hạn định.
 -  Khoảng thời gian giữa 2 lần kiểm tra liên tiếp của một sản phẩm, nếu không có sự thay đổi về số lượng, sẽ có xu hướng tăng dần
### Các biến
>   max_queuer: Số lượng queue được tạo, mặc định là 20
>   priority_unit: Số dùng để tính toán độ ưu tiên, mặc định là 500

### Dữ liệu
Các phần tử trong mỗi queue là một object có cấu trúc như sau:
|Tên trường|Mô tả|
|----------|-----|
|index| Số thứ tự của product trong queue|
|product| Product Id của sản phẩm, lấy từ tiki|
|sku| SKU của sản phẩm, lấy từ lazada|
|qty| Số lượng sản phẩm hiện tại được lưu trong database|
|priority| Độ ưu tiên của sản phẩm, dùng để đánh giá sản phẩm sẽ được kiểm tra trước hay sau. Priority càng nhỏ, tần suất kiểm tra sản phẩm càng cao.|

### Thuật toán
-   Khi bắt đầu lặp, chương trình sẽ sử dụng một hàm load dữ liệu từ database lên theo cấu trúc đã quy định ở trên. Đối với các sản phẩm có số lượng lớn hơn 0, độ ưu tiên (priority) sẽ được tính sao cho sản phẩm có sản phẩm ít nhất sẽ có độ ưu tiên nhỏ nhất là nhỏ nhất, tức là sản phẩm đó sẽ duyệt đầu tiên, các sản phẩm có số lượng sản phẩm bằng 0 sẽ được duyệt sau cùng theo thứ tự. Mục đích của việc sắp xếp này để một khi chương trình được chạy sẽ đảm bảo ưu tiên cập nhập các sản phẩm còn hàng trước, sau đó mới kiểm tra các sản phẩm đã hết.
-   Dữ liệu sẽ được chia thành max_queue phần bằng nhau. Thực hiện vòng lặp cho mỗi phần:
1. Lấy phần tử đầu tiên của mỗi quere, lúc này sẽ có 2 phần tạm gọi là **first** và **array**
2. Kiểm tra nếu số lượng của **first** lớn hơn 0 thì sẽ giảm priority của các sản phẩm còn lại xuống một đơn vị. Mục đích kiểm tra là để tránh trường hợp priority bị dồn về phía đầu queue nhiều, dẫn đến thuật toán chạy tuần tự.
3. Lấy số lượng sản phẩn từ lazada, sau đó so sánh với số lượng sản phẩm bên  tiki, nếu số lượng chênh lệch sẽ update lazada và database.
4. sau khi cập nhật thành công, sử dụng công thức sau để tính toán lại priority:
    `priority = số lượng sản phẩm * (PRIORITY_UNIT / MAX_QUEUE)`
    trường hợp số lượng sản phẩm bằng 0 priority sẽ được tính random một số lớn
    
    Số lượng sản phẩm có số lượng ít thường sẽ nhiều hơn số lượng sản phẩm có số lượng nhiều. Các sản phẩm có cùng số lượng thường dao động từ 100-150 sp, mỗi queue sẽ chứa từ 5-10 sản phẩm có cùng độ ưu tiên. Tùy vào số PRIORITY_UNIT cài đặt ban đầu thì priority sẽ được phân bố khác nhau. Nếu PRIORITY_UNIT nhỏ, thuật toán sẽ có xu hướng chạy tuần tự, PRIORITY_UNIT lớn thì thuật toán sẽ kiểm tra một sản phẩm thường xuyên hơn.
    
    
5. insert **first** vào **array**, sau đó sort lại **array** theo priority tăng dần
