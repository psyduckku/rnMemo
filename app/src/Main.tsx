import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, FlatList, TouchableOpacity, Pressable, Animated} from 'react-native';
import {View, Text, Button} from 'react-native';
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function HomeScreen({navigation}) {

  useFocusEffect(
    React.useCallback(() => {
        // 화면이 포커스를 받을 때마다 실행
        loadMemo();

        return () => {
            // 포커스를 잃을 때 실행할 코드 (옵션)
            // clearThat();  
        };
    }, []) //여기에 list를 넣으면 안되는 이유가 뭐였지? 의존성 배열의 값이 변경되면 useFocusEffect가 다시 실행됨
);

    const [list, setList] = useState<Memo[]>([]);
    const [order, setOrder] = useState(false); //true asc , false desc

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

          if(prev.important&&!next.important) return -1;
          if(!prev.important&&next.important) return 1;

          if(order ===false){
            return dataB.getTime() - dataA.getTime();
          }else{
            return dataA.getTime() - dataB.getTime();
          }

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

  const deleteItem = async (id) => {
    const newList = list.filter(item => item.id !== id);
    console.log(newList);
    setList(newList);
    await AsyncStorage.removeItem(id);
  }

  const renderRightActions = (dragX, id) => {
    const trans = dragX.interpolate({
      inputRange : [0, 50, 100, 101],
      outputRange : [-20, 0, 0, 1],
    });
    return (
      <Pressable onPress={()=>{deleteItem(id)}}>
        <Animated.View
          style={[
            styles.deleteContainer,
            {
              transform: [{translateX: trans}],
            },
          ]}>
            <Text style={styles.deleteText}>Delete</Text>
          </Animated.View>
      </Pressable>
    )
  }

  //잘모르는거
  const markAsImportant = async (id) => {
    const updatedList = list.map(item => {
      
      if(item.id === id){
        return { ...item, important: !item.important};
      }
      return item;
    })
    setList(updatedList);
    
    const updatedMemo = updatedList.find(item => item.id === id);
    await AsyncStorage.setItem(id, JSON.stringify(updatedMemo));
  };

  const renderLeftActions = (dragX, id) => {
    const trans = dragX.interpolate({
      inputRange : [0, 50, 100, 101],
      outputRange : [0, 0,0 , 1],
    });
    return(
      <Pressable onPress = {() => {markAsImportant(id)}}>
        <Animated.View
          style={[
            styles.importantContainer,
            { transform: [{ translateX: trans}]}
          ]}
        >
          <Text style={styles.importantText}>★</Text>
        </Animated.View>
      </Pressable>
    )
  };


  const renderItem = ({item, index}) => (
    <GestureHandlerRootView>
      <Swipeable 
        renderRightActions={dragX => renderRightActions(dragX, item.id)}
        renderLeftActions={dragX => renderLeftActions(dragX, item.id)}
        >
        <View style={{padding: 10, borderBottomWidth: 1, borderColor : '#ccc'}}>
          <TouchableOpacity
            onPress = {() => navigation.navigate('Detailed', {item: item})}>        
                <Text style={{fontSize: 18, fontWeight: item.important ? 'bold': 'normal'}}>{item.title}</Text>
                <Text style={{fontSize: 14, paddingLeft:5}}>{item.content}</Text>
          </TouchableOpacity>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
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
          {/*FlatList 들어갈곳*/}
          <FlatList
            data = {list}
            keyExtractor = {(item) => item.id} //각 항목의 고유한 key를 부여함
            renderItem={renderItem}/>
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
  },
  deleteContainer: {
    justifyContent: 'center', // 수직 가운데 정렬
    height: 48, // 리스트 항목과 동일한 높이 (필요에 따라 수정)
    padding: 10,
    backgroundColor: 'red', // 배경색을 변경하고 싶으면 설정
  },
  deleteText: {
    fontSize: 14,
    color: 'white', // 텍스트 색상
  },
  importantContainer: {
    justifyContent : 'center',
    height: 48,
    padding : 10,
    backgroundColor: 'gold',
  },
  importantText: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
  }

});
