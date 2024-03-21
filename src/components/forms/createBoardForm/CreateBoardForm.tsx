import { Input, Button, Form } from "antd";
import { ReactElement } from "react";
import { createNewBoard, updateBoard } from "../../../services/BoardService";
import Cookies from "js-cookie";
import "./CreateBoardForm.css"
import { ICreateUPdateBoardModal } from "../../../interfaces/components/modal/ICreateUpdateBoardModal";
import "./CreateBoardForm.css"

const CreateBoardForm = ({ handleCancel, setIsSpinning, isCreating, boardId }: ICreateUPdateBoardModal): ReactElement => {
    const [form] = Form.useForm()
    const token = Cookies.get("jwt-token")

    const onSubmitCreate = async () => {
        setIsSpinning!(true)
        handleCancel()
        const boardName: string = form.getFieldValue("boardTitle")
        await createNewBoard(boardName, token!)
        setTimeout(() => {
            setIsSpinning!(false)
        }, 1000)
    }

    const onSubmitUpdate = async () => {
        handleCancel()
        const newBoardName = form.getFieldValue("boardTitle")
        await updateBoard(newBoardName, boardId!, token!)
    }

    if (isCreating) {
        return (
            <Form
                layout="vertical"
                form={form}
                onFinish={onSubmitCreate}
                autoComplete="off"
            >
                <Form.Item
                    name="boardTitle"
                    label="Insert the name of the board"
                    rules={[{ required: true, message: 'Please input the title of the board' }]}
                >
                    <Input
                        allowClear
                    />
                </Form.Item>
                <Form.Item>
                    <div className="buttons">
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                        <Button onClick={handleCancel}>
                            Cancel
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        )
    } else {

        return (
            <Form
                layout="vertical"
                form={form}
                onFinish={onSubmitUpdate}
                autoComplete="off"
            >
                <Form.Item
                    name="boardTitle"
                    label="Update the name of the board"
                    rules={[{ required: true, message: 'Please input the title of the board' }]}
                >
                    <Input
                        allowClear
                    />
                </Form.Item>
                <Form.Item>
                    <div className="buttons">
                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>
                        <Button onClick={handleCancel}>
                            Cancel
                        </Button>
                    </div>
                </Form.Item>
            </Form>

        )
    }
}

export default CreateBoardForm