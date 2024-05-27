import { Fragment } from 'react';
import { Col, Divider, Row } from 'antd';
import Avatar from './components/Avatar';
import UserDetail from './components/UserDetail';

const UserInfo = () => {

    return (
        <Fragment>
            <Row wrap={false}>
                <Col style={{ width: 200 }}><Avatar /></Col>
                <Divider type="vertical" style={{ height: "auto" }} />
                <Col style={{
                    width: "100%",
                    margin: "0 auto",
                    padding: 12,
                }}>
                    <UserDetail />
                </Col>
            </Row>
        </Fragment>
    );
}

export default UserInfo