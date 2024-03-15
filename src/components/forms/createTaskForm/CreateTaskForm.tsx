import { Input, Button, Form, Select, SelectProps } from "antd";
import { ReactElement } from "react";
import { ISuccessRegistrationModal } from "../../../interfaces/components/modal/ISuccessRegistrationModal";
import Cookies from "js-cookie";
import { createTask } from "../../../services/TaskService";
import { useNavigate } from "react-router-dom";
import "./CreateTaskForm.css"


const CreateTaskForm = ({ handleCancel, selectedBoardId, setSelectedBoardId }: ISuccessRegistrationModal): ReactElement => {
    const [form] = Form.useForm()
    const token = Cookies.get("jwt-token")
    const navigate = useNavigate()

    const selectOptions: SelectProps['options'] =
        [
            {
                label: "To do",
                value: "To do"
            },
            {
                label: "Work in progress",
                value: "Work in progress"
            },
            {
                label: "Review",
                value: "Review"
            },
            {
                label: "Done",
                value: "Done"
            }
        ]

    const onSubmit = async () => {
        const formValues = form.getFieldsValue()
        await createTask(token!, {
            taskName: formValues.taskName,
            status: formValues.status,
            boardId: selectedBoardId
        })
        handleCancel()
        setSelectedBoardId!(parseInt(localStorage.getItem("my-board-id")!))
        navigate("/spinner")
    }

    return (
        <Form form={form}
            name="new_task_form"
            onFinish={onSubmit}
            layout="vertical"
        >
            <Form.Item
                name="taskName"
                label="Task Name"
                rules={[{ required: true, message: 'Please input the task name!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true }]}>
                <Select
                    allowClear
                    placeholder="Please select"
                    options={selectOptions}
                />
            </Form.Item>
            <div className="buttons">
                <Button type="primary" htmlType="submit">
                    Add
                </Button>
                <Button onClick={handleCancel}>
                    Cancel
                </Button>
            </div>
        </Form>
    );
};

export default CreateTaskForm