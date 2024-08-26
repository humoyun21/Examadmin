import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select, Upload } from "antd";
import { useCategoryStore } from "@store";
import { InboxOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import './style.scss'; // Import the stylesheet

function Index (props: any) {
  const { Dragger } = Upload;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getCategories }: any = useCategoryStore();
  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState<any[]>([]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  async function fetchCategories() {
    const response = await getCategories();
    setCategories(response);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const onFinish = async (values: any) => {
    const formData = new FormData();

    Object.keys(values).forEach(key => {
      if (key !== 'photos') {
        formData.append(key, values[key]);
      }
    });

    fileList.forEach(file => {
      formData.append('photos', file.originFileObj);
    });

    try {
      const response = await fetch('https://trade.namtech.uz/product', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      const result = await response.json();
      if (result.variant === "success") {
        toast.success('Product created successfully', { autoClose: 1200 });
        props?.requestData();
      } else {
        toast.error('Error creating product', { autoClose: 1200 });
      }
      handleOk();
    } catch (error) {
      toast.error('Error creating product', { autoClose: 1200 });
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (info: any) => {
    const { status } = info.file;
    if (status !== 'uploading') {
      setFileList(info.fileList);
    }
  };

  return (
    <>
      <Button type="default" onClick={showModal} className="add-product-button">
        Add Product
      </Button>
      <Modal
        footer={false}
        title="Add Product"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="product-modal"
      >
        <Form onFinish={onFinish} className="product-form">
          <Form.Item
            name={"title"}
            rules={[
              { required: true, message: "Please input product title!" },
            ]}
            hasFeedback
          >
            <Input className="input-field" placeholder="Product Title" />
          </Form.Item>

          <Form.Item
            name={"price"}
            rules={[
              { required: true, message: "Please input product price!" },
            ]}
            hasFeedback
          >
            <Input className="input-field" type="number" placeholder="Price" />
          </Form.Item>

          <Form.Item
            name={"oldPrice"}
            rules={[
              { required: true, message: "Please input product old price!" },
            ]}
            hasFeedback
          >
            <Input className="input-field" type="number" placeholder="Old Price" />
          </Form.Item>

          <Form.Item
            name={"categoryId"}
            rules={[
              { required: true, message: "Please select product category!" },
            ]}
            hasFeedback
          >
            <Select className="category-select" placeholder={"Select Category"}>
              {categories?.map((category: any) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name={"units"}
            rules={[
              { required: true, message: "Please input product units!" },
            ]}
            hasFeedback
          >
            <Input className="input-field" placeholder="Units (e.g., kg)" />
          </Form.Item>

          <Form.Item
            name={"desc"}
            rules={[
              { required: true, message: "Please input product description!" },
            ]}
            hasFeedback
          >
            <Input.TextArea className="textarea-field" placeholder="Description" />
          </Form.Item>

          <Form.Item name={"photos"}>
            <Dragger
              multiple={true}
              fileList={fileList}
              beforeUpload={() => false}
              onChange={handleChange}
              className="upload-dragger"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Drag files here or click to upload</p>
            </Dragger>
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" type="default" className="submit-button">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Index;
