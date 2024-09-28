import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Button, TextInput, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';


export default function Writing({navigation}){

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [saveBtn, setSaveBtn] = useState(false);
    const [isSaving, setIsSaving] = useState(false); //저장중일 때 true

    useFocusEffect(
        React.useCallback(() => { 
            console.log("세이브 : "+saveBtn);
            //여기다가 title, content가 .length 1이상일 때 set을 하도록 함. 
            const unsubscribe = navigation.addListener('beforeRemove', (e) => {
                if((title.length > 0 || 0 < content.length) && !isSaving){
                    e.preventDefault();
                    Alert.alert(
                        'Discard it?',  //title
                        '저장하지 않으시겠습니까?', //content
                        [
                            {text: '취소', style : 'cancel', onPress: () => {}},
                            {text: '네', onPress: () => navigation.dispatch(e.data.action)}
                            //dispatch(e.data.action) -> 확인 버튼 누를 시 이전화면으로 이동을 수행
                        ]
                    );
                }
        
            });
            return unsubscribe; //컴포넌트 언마운트 시 리스너 해제
        }, [navigation, title, content, isSaving]) //title과 content가 변경될 때마다 리스너를 새로 등록
    ); //navigation은 현재 마운트된 컴포넌트의 정보를 참조하여 최신화된 navigation객체를 업데이트함
    
    useEffect(()=>{
        if(title.length > 0 && content.length > 0){
            setSaveBtn(true);
        }else{
            setSaveBtn(false);
        }
    }, [title, content, saveBtn])
    
    
    const goBack = () =>{
        navigation.goBack(); // 현재 스택을 제거하고, 이전 스택으로 돌아감.
    }

    const handleTextChange = (text, type) => { //타입에 따라서 분기

        if(type === 'title'){
            setTitle(text);
        }else {
            setContent(text);
        }

    };

    const save = async () => {
        setIsSaving(true);

        const dateKey = new Date().toLocaleString('sv-SE');
        const memo = {
            id : dateKey,
            title : title,
            content : content,
            important : false,
            deleted : false,
        }
        try{
            await AsyncStorage.setItem(dateKey, JSON.stringify(memo));
            navigation.goBack();
        }catch(error){
            setIsSaving(false);
            console.log('failed save :', error);
        }finally{
            setIsSaving(false);
        }
        
    };

    return(
        <View style={style.container}>
            <Nav title={title} handleTextChange={handleTextChange} goBack={goBack} save={save} saveBtn={saveBtn}/>
            <Body content={content} handleTextChange={handleTextChange}/>
        </View>
    )
}

function Nav({title, handleTextChange, goBack, saveBtn, save}){

    return(
        <View style={style.nav}>
            <TouchableOpacity onPress={goBack} style={style.icon}>
                <Text>◀</Text>
            </TouchableOpacity>
            <TextInput 
                value={title}
                onChangeText={(text)=>{ handleTextChange(text, 'title')}}
                style={style.titleInput} 
                placeholder='제목'>
            </TextInput>
            <TouchableOpacity onPress={save} style={[style.icon]} disabled={!saveBtn}>
                <Text style={{ color : saveBtn ? 'blue' : 'gray'}}>저장</Text>
            </TouchableOpacity>
        </View>
    )
}

function Body({content, handleTextChange}){
    return(
        <View style={style.body}>
            <TextInput 
                value={content}
                onChangeText={(text) => handleTextChange(text, 'content')}
                style={style.bodyInput} 
                placeholder="내용입력"></TextInput>
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        flex: 1,
    },nav : {
        flex: 1,
        flexDirection : 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },titleInput: {
        height: '100%', flex: 4, padding:10 , paddingLeft: 50,
    },icon : { width : 30, flex: 1, alignItems: 'center',
    },body: {
        flex: 9,
        backgroundColor: '#e6eaf0',
    },bodyInput:{
        flex: 1, padding: 10,
    },
});