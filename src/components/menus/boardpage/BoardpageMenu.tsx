import { Menu, Popconfirm } from "antd"
import { ReactElement, useEffect, useState } from "react";
import {
    UserOutlined,
    MailOutlined,
    HomeOutlined,
    CloseOutlined,
    CalendarOutlined,
    FileAddOutlined,
    PlusSquareOutlined
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { getUserDetails, logoutUser } from "../../../services/UserService";
import SubMenu from "antd/es/menu/SubMenu";
import Cookies from "js-cookie";
import { UserDetails } from "../../../interfaces/model/UserDetails";
import CreateBoardModal from "../../modals/createBoard/CreateUpdateBoardModal";
import { UserBoardAssociation } from "../../../interfaces/model/UserBoardAssociation";
import { getUserBoards } from "../../../services/BoardUserServices";
import { Board } from "../../../interfaces/model/Board";
import { IBoardPage } from "../../../interfaces/components/pages/IBoardPage";
import "./BoardpageMenu.css"
import CreateLaneModal from "../../modals/lane/CreateLaneModal";
import { getBoardById } from "../../../services/BoardService";

const BoardpageMenu = ({ setSelectedBoardId, selectedBoardId }: IBoardPage): ReactElement => {
    const navigate = useNavigate()
    const [board, setBoard] = useState<Board>()
    const [userDetails, setUserDetails] = useState<UserDetails>()
    const [userBoardsAssociation, setUserBoardsAssociation] = useState<UserBoardAssociation[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLaneModalOpen, setIsLaneModalOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState<boolean>();
    const token = Cookies.get("jwt-token")

    const handleLogout = (): void => {
        logoutUser()
        navigate("/")
    }

    useEffect(() => {
        const fetchUserDetailsAndBoard = async () => {
            const userDetailsResponse = await getUserDetails(token!)
            setUserDetails(userDetailsResponse.data)
            const getBoardResponse = await getBoardById(selectedBoardId!, token!)
            setBoard(getBoardResponse.data)
        }
        fetchUserDetailsAndBoard()
    }, [selectedBoardId, token])

    useEffect(() => {
        const fetchUserBoards = async () => {
            const response = await getUserBoards(token!)
            if (response !== undefined) {
                setUserBoardsAssociation(response.data)
            }
        }
        fetchUserBoards()
    }, [token])

    const handleNavigation = (boardId: number) => {
        setSelectedBoardId!(boardId)
        localStorage.setItem("my-board-id", boardId.toString())
        navigate("/spinner")
    }

    const boardItem = () => {
        return (
            userBoardsAssociation.map((element: Board) => (
                <Menu.Item
                    title={element.boardName}
                    onClick={() => handleNavigation(element.boardId!)}
                >
                    {element.boardName}
                </Menu.Item>
            )
            )
        )
    }

    const showModal = () => {
        setIsModalOpen(true)
    }

    const showLaneModal = () => {
        setIsLaneModalOpen(true)
    }

    const handleCancel = () => {
        setIsModalOpen(false)
        setIsLaneModalOpen(false)
    }

    
    const showPopconfirm = () => {
        setConfirmOpen(true);
    }

    const handleOk = () => {
        handleLogout();
    }

    const closeConfirm = () => {   
        setConfirmOpen(false)
    }

    const checkIfUserIsEditor = (): boolean => {
        let userIsEditor = false
        board?.users?.map(user => {
            if (user.email === userDetails?.email && user.roleCodeForBoard === "EDITOR") {
                userIsEditor = true
            }
        })
        return userIsEditor
    }

    const roleHandler = () => {
        if (userDetails?.roles[0].name === "ROLE_ADMIN") {
            return (
                <>
                    <Menu.Item key="4" icon={<FileAddOutlined />} onClick={showModal}>
                        Create Board
                    </Menu.Item>
                    <CreateBoardModal
                        showModal={showModal}
                        isModalOpen={isModalOpen}
                        handleCancel={handleCancel}
                        isCreating={true}
                    />
                </>
            )
        } else if (checkIfUserIsEditor()) {
            return (
                <>
                    <Menu.Item
                        icon={<PlusSquareOutlined />}
                        onClick={showLaneModal}>
                        New Lane
                    </Menu.Item>
                    <CreateLaneModal
                        showLaneModal={showLaneModal}
                        isLaneModalOpen={isLaneModalOpen}
                        handleCancel={handleCancel}
                        selectedBoardId={selectedBoardId}
                    />
                    <SubMenu
                        key="sub4"
                        title={"Boards"}
                        icon={<CalendarOutlined />}
                        className="submenu">
                        {boardItem()}
                    </SubMenu>
                </>
            )
        } else {
            return <></>
        }
    }

    return (
        <div>
            <Menu theme="dark"
                mode="inline">
                <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => navigate("/homepage")}>
                    Homepage
                </Menu.Item>
                <Menu.Item key="2" icon={<UserOutlined />} onClick={() => navigate("/profile")}>
                    Profile
                </Menu.Item>
                <Menu.Item key="3" icon={<MailOutlined />} onClick={() => navigate("/notifications")}>
                    Notifications
                </Menu.Item>
                {roleHandler()}
                <Menu.Item key="5" icon={<CloseOutlined />} onClickCapture={showPopconfirm}>
                    <Popconfirm
                        title="Do you want to logout?"
                        placement="bottom"
                        open={confirmOpen}
                        onConfirm={handleOk}
                        onCancel={closeConfirm}
                    >
                        Logout
                    </Popconfirm>
                </Menu.Item>
            </Menu>
        </div>
    )

}

export default BoardpageMenu