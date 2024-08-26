import { useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { useCategoryStore } from '@store';
import { toast } from 'react-toastify';
import './style.scss'; // Import the stylesheet

interface IndexProps {
    getData: () => void;
}

function Index({ getData }: IndexProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addCategory }: any = useCategoryStore();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    async function handleSubmit(value: any) {
        const response = await addCategory(value);
        if (response.status === 201) {
            toast.success('Category added successfully');
            getData();
            handleCancel();
        } else {
            toast.error('Failed to add category');
        }
    }

    return (
        <>
            <Button type="default" onClick={showModal} className="btn-open-category-modal">
                Add Category
            </Button>
            <Modal
                footer={null}
                title="Add Category"
                open={isModalOpen}
                onCancel={handleCancel}
                className="modal-add-category"
            >
                <Form className="form-add-category" onFinish={handleSubmit}>
                    <Form.Item
                        name="title"
                        rules={[{ required: true, message: 'Please input the category title!' }]}
                        hasFeedback
                    >
                        <Input className="input-category-title" placeholder="Enter Category Name" />
                    </Form.Item>
                    <Button type="default" htmlType="submit" className="btn-submit-category">
                        Submit
                    </Button>
                </Form>
            </Modal>
        </>
    );
}

export default Index;
