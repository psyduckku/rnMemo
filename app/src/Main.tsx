import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import {View, Text, Button} from 'react-native';
// import {State} from 'react-native-getsture-handler';
// import {useNavigationContainerRef} from '@react-navigation/native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Writing from './Writing';


export default function HomeScreen({navigation}) {

//   const navigation = useNavigation();
  // const navigationRef = useNavigationContainerRef();

  useFocusEffect(
    React.useCallback(() => {
        // 화면이 포커스를 받을 때마다 실행
        loadMemo();

        return () => {
            // 포커스를 잃을 때 실행할 코드 (옵션)
            // clearThat();  
        };
    }, [])
);


    const [list, setList] = useState<Memo[]>([]);
    let sortedMemos = [];


    const loadMemo = async () => {
        const keys = await AsyncStorage.getAllKeys();
        const result = await AsyncStorage.multiGet(keys);
        
        const memos = result.map(([key, value]) => {
          if(value){
            return JSON.parse(value);
          }
          return null;
        }).filter(memo => memo !== null) as Memo[];

        sortedMemos = memos.sort((prev, next) => {
          const dataA = new Date(prev.id);
          const dataB = new Date(next.id);
          return dataB.getTime() - dataA.getTime();

        });
        setList(sortedMemos);
      }

  const onMemoAdded = () => {
    loadMemo();
  }
    
  const clearThat = async () => {
    await AsyncStorage.clear();
    console.log('삭제완료');
  }

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress = {() => navigation.navigate('Detailed', {item: item})}>
        <View style={{padding: 10, borderBottomWidth: 1, borderColor : '#ccc'}}>
          <Text style={{fontSize: 18}}>{item.title}</Text>
          <Text style={{fontSize: 14, paddingLeft:5}}>{item.content}</Text>
        </View>
    </TouchableOpacity>
  );


  return (
    <View style={styles.background}>
      <View style={styles.top}>
        <View style={styles.side}>
        </View>
        <View style={styles.center}>
          <Text style={styles.appTitle}>MyFirst</Text>
        </View>
        <View style={styles.side}>
          <Button title="작성" onPress={() => navigation.navigate('Writing')} />
        </View>
      </View>


      <View style={styles.main}>
        <ScrollView>
          {/*FlatList 들어갈곳*/}
          <FlatList
            data = {list}
            keyExtractor = {(item) => item.id}
            renderItem={renderItem}/>
          {/* {
            list.map((memo, index) => (
              <View key={memo.id} style={styles.item}>
                <Text style={styles.title}>{memo.title}</Text>
                <Text style={styles.content}>{memo.content}</Text>
              </View>
            ))
            } */}
        </ScrollView>
      </View>

      <View style={styles.bottom}>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'white',
  },
  top: {
    flex: 1,
    backgroundColor: '#8a8787',
    flexDirection : 'row', //가로방향 배치 
    justifyContent: 'space-between', //요소 양끝과 중앙 배치 
    alignItems: 'center',
    paddingTop: 30
  },
  main: {
    flex: 7,
    backgroundColor: '#f7eceb',
  },
  bottom: {
    flex:1,
    backgroundColor: '#8a8787',
  },
  center: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  side: {
    flex: 1,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  item : {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor : '#fff',
    padding : 10,
    borderRadius: 5,
    elevation: 2,
  },
  title: { 
    fontSize: 16,
    marginBottom: 5,
    paddingLeft: 15

  },
  content: {
    fontSize: 14,
    color: '#555',
    paddingLeft: 25,
  }
});
