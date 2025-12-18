import React, { useState } from 'react';
import { Table, Button, Modal, Form, Select, DatePicker, Tag, Space, message, Popconfirm, Tabs, Checkbox, TimePicker } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import { 
  facilityService, 
  RoomSlotTypeEnum, 
  RoomSlotStatusEnum, 
  getSlotTypeLabel, 
  getSlotStatusLabel 
} from '@/services/facility.service';
import { handleAfterDelete } from '@/utils/pagination';

const RoomSlotPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [activeTab, setActiveTab] = useState('single'); // 'single' | 'semester'
  const queryClient = useQueryClient();

  // --- 1. FETCH DATA ---
  const { data: slotData, isLoading } = useQuery({
    queryKey: ['roomSlots', pagination.current, pagination.pageSize],
    queryFn: () => facilityService.getRoomSlots({
      page: pagination.current,
      size: pagination.pageSize
    }),
  });
  
  const dataSource = slotData?.data?.items || [];
  const totalItems = slotData?.data?.totalItems || 0;

  const { data: roomData } = useQuery({
    queryKey: ['rooms_all'],
    queryFn: () => facilityService.getRooms({ size: 100 }),
  });
  const rooms = roomData?.data?.items || [];

  // --- 2. LOGIC TẠO LỊCH (QUAN TRỌNG) ---
  
  // Hàm sinh danh sách các request từ form
  const generateBulkPayloads = (values: any) => {
    const payloads: any[] = [];
    const { roomId, slotType, status } = values;

    // Format chuẩn để gửi lên BE (Giữ nguyên giờ địa phương, không convert sang UTC)
    const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

    if (activeTab === 'single') {
      const [start, end] = values.singleTimeRange;
      payloads.push({
        roomId, 
        slotType: Number(slotType),
        status: Number(status),
        // Thay toISOString() bằng format()
        startTime: dayjs(start).format(DATE_FORMAT),
        endTime: dayjs(end).format(DATE_FORMAT),
      });
    } else {
      const [semStart, semEnd] = values.semesterRange;
      const [timeStart, timeEnd] = values.timeSlot;
      const selectedDays = values.daysOfWeek;

      let currentDate = dayjs(semStart).startOf('day');
      const endDate = dayjs(semEnd).endOf('day');

      while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
        if (selectedDays.includes(currentDate.day())) {
          // Set giờ phút giây cho ngày hiện tại
          const startDateTime = currentDate
            .hour(timeStart.hour())
            .minute(timeStart.minute())
            .second(0);
            
          const endDateTime = currentDate
            .hour(timeEnd.hour())
            .minute(timeEnd.minute())
            .second(0);

          payloads.push({
            roomId, 
            slotType: Number(slotType),
            status: Number(status),
            // Thay toISOString() bằng format()
            startTime: startDateTime.format(DATE_FORMAT),
            endTime: endDateTime.format(DATE_FORMAT),
          });
        }
        currentDate = currentDate.add(1, 'day');
      }
    }
    return payloads;
  };

  // --- 3. MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: async (values: any) => {
      const payloads = generateBulkPayloads(values);
      
      if (payloads.length === 0) {
        throw new Error("Không có ngày nào phù hợp trong khoảng thời gian chọn!");
      }

      if (payloads.length > 100) {
         // Cảnh báo nếu tạo quá nhiều
         // throw new Error("Số lượng slot quá lớn (>100). Vui lòng chia nhỏ khoảng thời gian.");
      }

      // Gửi song song tất cả request (Promise.all)
      // Lưu ý: Nếu 1 cái fail, cả cụm sẽ fail (tùy logic xử lý lỗi).
      // Ở đây ta dùng map để gọi API
      return Promise.all(payloads.map(p => facilityService.createRoomSlot(p)));
    },
    onSuccess: (results) => {
      message.success(`Đã tạo thành công ${results.length} slots!`);
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ['roomSlots'] });
    },
    onError: (error: any) => {
      console.error(error);
      message.error(error.message || 'Có lỗi xảy ra khi tạo slot');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => facilityService.deleteRoomSlot(id),
    onSuccess: () => {
      message.success('Đã xóa slot');
      handleAfterDelete(
        queryClient,
        ['roomSlots'],
        pagination,
        setPagination,
        dataSource.length
      );
      
    },
  });

  // --- 4. HELPER & HANDLERS ---
  const getRoomName = (id: string) => {
    const room = rooms.find((r: any) => r.id === id);
    return room ? `${room.roomName} (${room.roomNumber})` : id;
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setActiveTab('single');
  };

  const columns = [
    { 
        title: 'Phòng', dataIndex: 'roomId', key: 'roomId',
        render: (id: string) => {
            const room = rooms.find((r: any) => r.id === id);
            return <b style={{ color: '#1890ff' }}>{room ? room.roomName : id}</b>;
        }
    },
    {
      title: 'Bắt đầu', dataIndex: 'startTime', key: 'startTime',
      render: (text: string) => <span>{dayjs(text).format('DD/MM/YYYY HH:mm')}</span>
    },
    {
        title: 'Kết thúc', dataIndex: 'endTime', key: 'endTime',
        render: (text: string) => <span>{dayjs(text).format('DD/MM/YYYY HH:mm')}</span>
    },
    {
      title: 'Loại Block', dataIndex: 'slotType', key: 'slotType',
      render: (type: any) => <Tag color="blue">{getSlotTypeLabel(type)}</Tag>
    },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status',
      render: (status: any) => {
         const label = getSlotStatusLabel(status);
         const color = label.includes('Available') ? 'success' : (label.includes('Booked') ? 'volcano' : 'default');
         return <Tag color={color}>{label}</Tag>;
      }
    },
    {
      title: 'Hành động', key: 'action',
      render: (_: any, record: any) => (
        <Popconfirm title="Xóa?" onConfirm={() => deleteMutation.mutate(record.id)}>
          <Button type="text" icon={<DeleteOutlined style={{ color: 'red' }} />} />
        </Popconfirm>
      ),
    },
  ];

  // Options cho checkbox thứ
  const dayOptions = [
    { label: 'Thứ 2', value: 1 },
    { label: 'Thứ 3', value: 2 },
    { label: 'Thứ 4', value: 3 },
    { label: 'Thứ 5', value: 4 },
    { label: 'Thứ 6', value: 5 },
    { label: 'Thứ 7', value: 6 },
    { label: 'Chủ Nhật', value: 0 },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Quản lý Lịch Phòng (Slots)</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Tạo Lịch Mới
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={dataSource} 
        rowKey="id" 
        loading={isLoading}
        pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: totalItems,
            onChange: (p, s) => setPagination({ current: p, pageSize: s }),
        }}
      />

      <Modal
        title="Tạo Khung Giờ Hoạt Động"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        <Form 
            form={form} 
            layout="vertical" 
            onFinish={(vals) => createMutation.mutate(vals)}
            initialValues={{ 
                slotType: RoomSlotTypeEnum.Block3,   // Default là số 0
                status: RoomSlotStatusEnum.Available // Default là số 0
            }}
        >
          <Form.Item 
            name="roomId" 
            label="Chọn Phòng" 
            rules={[{ required: true, message: 'Vui lòng chọn phòng' }]}
          >
            <Select placeholder="Chọn phòng..." showSearch optionFilterProp="children">
              {rooms.map((r: any) => (
                <Select.Option key={r.id} value={r.id}>{r.roomName} - {r.roomNumber}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={[
                {
                    key: 'single',
                    label: 'Tạo Lẻ (1 Slot)',
                    children: (
                        <Form.Item 
                            name="singleTimeRange" 
                            label="Thời gian cụ thể"
                            rules={[{ required: activeTab === 'single', message: 'Chọn thời gian' }]}
                        >
                            <DatePicker.RangePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                    )
                },
                {
                    key: 'semester',
                    label: 'Tạo Theo Kỳ (Hàng loạt)',
                    children: (
                        <>
                            <Form.Item 
                                name="semesterRange" 
                                label="Khoảng thời gian (Ngày bắt đầu - Kết thúc)"
                                rules={[{ required: activeTab === 'semester', message: 'Chọn ngày bắt đầu/kết thúc' }]}
                            >
                                <DatePicker.RangePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item 
                                name="timeSlot" 
                                label="Khung giờ (Ví dụ: 07:00 - 09:00)"
                                rules={[{ required: activeTab === 'semester', message: 'Chọn khung giờ' }]}
                            >
                                <TimePicker.RangePicker format="HH:mm" style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item 
                                name="daysOfWeek" 
                                label="Lặp lại vào các thứ"
                                rules={[{ required: activeTab === 'semester', message: 'Chọn ít nhất 1 thứ' }]}
                            >
                                <Checkbox.Group options={
                                    [
                                        { label: 'Thứ 2', value: 1 },
                                        { label: 'Thứ 3', value: 2 },
                                        { label: 'Thứ 4', value: 3 },
                                        { label: 'Thứ 5', value: 4 },
                                        { label: 'Thứ 6', value: 5 },
                                        { label: 'Thứ 7', value: 6 },
                                        { label: 'Chủ Nhật', value: 0 },
                                    ]
                                } />
                            </Form.Item>
                        </>
                    )
                }
            ]}
          />

          {/* SỬA SELECT OPTION VALUE THÀNH SỐ (ENUM) */}
          <div style={{ display: 'flex', gap: 16 }}>
             <Form.Item name="slotType" label="Loại Block" style={{ flex: 1 }}>
                <Select>
                    {/* Value là Số (Integer) */}
                    <Select.Option value={RoomSlotTypeEnum.Block3}>Block 3</Select.Option>
                    <Select.Option value={RoomSlotTypeEnum.Block10}>Block 10</Select.Option>
                </Select>
             </Form.Item>
             
             <Form.Item name="status" label="Trạng thái" style={{ flex: 1 }}>
                <Select disabled>
                    {/* Value là Số (Integer) */}
                    <Select.Option value={RoomSlotStatusEnum.Available}>Available (Trống)</Select.Option>
                </Select>
             </Form.Item>
          </div>

          <div style={{ textAlign: 'right' }}>
            <Button onClick={handleCloseModal} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={createMutation.isPending}>
              {activeTab === 'single' ? 'Tạo' : 'Tạo Hàng Loạt'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomSlotPage;