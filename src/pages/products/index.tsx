import { useEffect, useState } from "react";
import './style.scss';
import { useProductStore } from "@store";
import { AddProductModal, Table } from "@ui";
import { Button, Space, Tag } from "antd";
import { toast, ToastContainer } from "react-toastify";

function Products() {
  const { getProducts, removeProducts }: any = useProductStore();
  const [data, setData] = useState([]);
  const [count, setCount] = useState(1);
  const [load, setLoad] = useState(false);

  async function getDatas() {
    setLoad(true);
    const payload = {
      skip: count,
      limit: 8
    };
    const response = await getProducts(payload);
    setData(response);
    setLoad(false);
  }

  async function deleteProducts(data: any) {
    const response = await removeProducts(data);
    if (response?.status === 200) {
      toast.success('Deleted products successfully');
      getDatas();
    } else {
      toast.error('Failed to delete products');
    }
  }

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => {
        const title = text.length > 32 ? text.slice(0, 32) + '...' : text;
        return <a className="product-title">{title}</a>;
      },
    },
    {
      title: 'Category Name',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (text: any) => <a className="category-name">{text?.title}</a>,
    },
    {
      title: 'Photo',
      dataIndex: 'urls',
      key: 'urls',
      render: (text: any) => <img src={text[0]} alt="product" className="product-image" />,
    },
    {
      title: 'Price',
      key: 'price',
      dataIndex: 'price',
      render: (text: number) => {
        if (text > 1000) {
          return <Tag color="error" className="price-tag">{text}</Tag>;
        } else if (text > 500) {
          return <Tag color="primary" className="price-tag">{text}</Tag>;
        } else {
          return <Tag color="success" className="price-tag">{text}</Tag>;
        }
      },
    },
    {
      title: 'Old Price',
      key: 'oldPrice',
      dataIndex: 'oldPrice',
      render: (text: number) => {
        if (text > 1000) {
          return <Tag color="error" className="old-price-tag">{text}</Tag>;
        } else if (text > 500) {
          return <Tag color="primary" className="old-price-tag">{text}</Tag>;
        } else {
          return <Tag color="success" className="old-price-tag">{text}</Tag>;
        }
      },
    },
    {
      title: 'CreatedAt',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (text: string) => <a className="creation-date">{text?.slice(0, 10)}</a>
    },
    {
      title: 'Units',
      key: 'units',
      dataIndex: 'units',
      render: (text: any) => <a className="units">{text}</a>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="default" 
            danger 
            onClick={() => deleteProducts(record?._id)}
            className="delete-product-button"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getDatas();
  }, [count]);

  return (
    <>
      <ToastContainer />
      <div className="products-container">
        <AddProductModal requestData={getDatas} />
        <Table load={load} data={data} columns={columns} />
        {data.length > 0 && (
          <div className="pagination-controls">
            <Button
              className="pagination-button"
              disabled={count === 1}
              onClick={() => setCount(count - 1)}
            >
              Prev
            </Button>
            <span className="pagination-info">{count}</span>
            <Button
              className="pagination-button"
              disabled={data.length !== 8}
              onClick={() => setCount(count + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

export default Products;
