import { NavigationAction } from "@react-navigation/native";
let _navigator;


function setTopLevelNavigator(navigatorRef){
    _navigator = navigatorRef;

}

function navigate(routeName, params){
    _navigator.navigate(routeName,params);
}

function goBack(){
    _navigator.dispatch(NavigationAction.back());
}

export default {

    navigate,
    setTopLevelNavigator,
    goBack
}