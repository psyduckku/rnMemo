import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Edited({route, navigation}){

    let {item} = route.params;
    
    const [title, setTitle] = useState(item.title);
    const [content, setContent] = useState(item.content);
    const initItem = item.title;
    const initContent = item.content;

    const newItem = {  //title, content이외는 그대로 복사(스프레드연산자)
        ...item,  
        title : title,
        content : content,
    }

    const goBack = () => {
        //변경하지 않고 돌아가기할 경우 경고를 띄움 
        if(initItem !== title || initContent !== content){
            Alert.alert(
                '수정안해?',
                '저장하지 않고 돌아가시겠습니까?',
                [
                    {text: '네', onPress: () =>{navigation.goBack()}},
                    {text: '아니요', style: 'cancel', onPress: ()=>{}}
                ]
            )
        }
        navigation.goBack();
    }

    const save = () => {
        
        if(initItem !== title || initContent !== content){
            
            Alert.alert(
                '수정ㄱ?',
                '수정하시겠습니까?',
                [
                    {text : '네', onPress: async () => {
                        try{
                            const getItem = await AsyncStorage.getItem(item.id);
                            if(getItem){
                                AsyncStorage.setItem(item.id, JSON.stringify(newItem));
                                navigation.navigate('Detailed', {item : newItem});   
                            }
                        }catch(error){
                            console.error("save error", error);
                        }
                        
                    }},
                    {
                        text: '아니요?', onPress : () => {navigation.goBack()}
                    }
                ]
            );
                
        }else if(initItem === title && initContent === content){
            navigation.goBack();
        }else{
            Alert.alert('오류발생');
        }
    }

    const handleTextChange = (text, type) => { 
        if(type==='title'){
            setTitle(text);
        }else{
            setContent(text);
        }
    }

    return(
        <View>
            <Nav title={title} goBack={goBack} handleTextChange={handleTextChange} save={save}/>
            <Body body={content} handleTextChange={handleTextChange}/>
        </View>
    )
}

function Nav({title, goBack, save, handleTextChange}){

    return(
        <View style={style.nav}>
            <TouchableOpacity onPress={goBack} style={{flex:1}}>
                <Text>◀</Text>
            </TouchableOpacity>
            <TextInput value={title} onChangeText={(text)=>{handleTextChange(text, 'title')}}
                style={{flex: 5}}></TextInput>
            <TouchableOpacity onPress={save} style={{flex:1}}>
                <Text>
                    저장
                </Text>
            </TouchableOpacity>
        </View>
    )
}

function Body({body, handleTextChange}){

    return(
        <View>
            <TextInput value={body} onChangeText={(text)=>{ handleTextChange(text, 'content')}}>
                
            </TextInput>
        </View>
    )
}

const style = StyleSheet.create({
    nav: {
      flexDirection: 'row',
    }
})