import React, {PropTypes} from 'react';
import BsModal from 'react-bootstrap/lib/Modal';

const Modal = (props) => {
    const {title, body, footer, ...other} = props;
    const modal = (
        <BsModal {...other}>
            <BsModal.Header>
                <BsModal.Title>{title}</BsModal.Title>
            </BsModal.Header>
            <BsModal.Body>
                {body}
            </BsModal.Body>
            {footer ? (
                <BsModal.Footer>
                    {footer}
                </BsModal.Footer>
            ) : ""}
        </BsModal>
    );
    return modal;
};

Modal.propTypes = {
    title: PropTypes.string.isRequired,
    body: PropTypes.element.isRequired,
    footer: PropTypes.element
};

export default Modal;