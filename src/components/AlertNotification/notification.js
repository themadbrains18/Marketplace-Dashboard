import { ReactNotifications, Store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

const AlertNotification = function (props) {

    console.log(props.alert);
    if(props.alert.type!=undefined){
        Store.addNotification({
            title: props.alert.type == "danger"?'Error' : props.alert.type == "warning"? "Warning" : props.alert.type == "success"?'Wonderful!':'',
            message: props.alert.message,
            type: props.alert.type,
            insert: "left",
            container: "top-left",
            dismiss: {
                duration: 3000,
                onScreen: true
            }
        });
    }

    return (
        <ReactNotifications />
    )
}

export default AlertNotification;