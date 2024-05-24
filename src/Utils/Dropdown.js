import {useState,useEffect,useCallback} from 'react';
import { View, Text, ScrollView, StyleSheet,TouchableOpacity,Modal,FlatList,Pressable,RefreshControl} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import ProgressLoader from 'rn-progress-loader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { SearchBar } from 'react-native-elements';

var db = openDatabase({ name: 'CMMS.db' });


export const Dropdown = () => {

    const [textvalue, settextvalue] = useState('');
    const [data, setdata] = useState([]);
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [modalVisible, setmodalVisible ] = useState(false); 
    const [search, setSearch] = useState('');


    
    useEffect(() => {

      const focusHander = navigation.addListener('focus', ()=>{
  
        get_dropdown()
        
  
      });
      return focusHander;
  
      
    },[]);

     const get_dropdown =(selecttext,selectdata) =>{
       
        console.log(data)
          settextvalue(dropname);
          setFilteredDataSource(data);
          setdata(data);
          setmodalVisible(!modalVisible);
      }
  
      //ASSET LIST FILTER
      const searchFilterFunction = (text) => {
          // Check if searched text is not blank
          if (text) {
  
            let newData; 
  
            if(textvalue == 'Created By'){
  
                newData = dropdown_data.filter(function (item) {
              
                const itemData = `${item.emp_mst_empl_id.toUpperCase()},
                ,${item.emp_mst_title.toUpperCase()}
                ,${item.emp_mst_name.toUpperCase()})`
            
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
              });
            
  
            }else if(textvalue == 'Cost Center'){
  
              newData = dropdown_data.filter(function (item) {
              
                const itemData = `${item.costcenter.toUpperCase()},
                ,${item.descs.toUpperCase()})`
            
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
              });
  
  
            }else if(textvalue == 'Asset Status'){
  
              newData = dropdown_data.filter(function (item) {
              
                const itemData = `${item.ast_sts_status.toUpperCase()},
                ,${item.ast_sts_desc.toUpperCase()})`
            
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
              });
  
  
            }
            setFilteredDataSource(newData);
            setSearch(text);
            
          } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredDataSource(dropdown_data);
            setSearch(text);
          }
      };
  
  
      const onRefresh = useCallback(async () => {
  
        setRefreshing(true);
  
        if(textvalue == 'Created By'){
          setFilteredDataSource(Employee);
        }else  if(textvalue == 'Created By'){
          setFilteredDataSource(CostCenter);
        }else if(textvalue == 'Asset Status'){
          setFilteredDataSource(AssetStatus);
        }else if(textvalue == 'Asset Type'){
          setFilteredDataSource(AssetType);
        }
  
        
        setRefreshing(false)
      }, [refreshing]);
  
      const renderText = (item) => {
      if (textvalue == 'Created By'){
          
          return (
            <View style={styles.dropdown_style}>
  
              <View style={{flexDirection:"row",marginTop:5,marginLeft:5}}>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >ID :</Text>
                </View>
                <View style={{flex:4}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#2962FF'}} >{item.emp_mst_empl_id}</Text>
                </View>
              </View>
  
              <View style={{flexDirection:"row",marginTop:5,marginLeft:5}}>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{color:'#000',fontWeight: 'bold',justifyContent: 'flex-start'}} >Name :</Text>
                </View>
                <View style={{flex:4}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.emp_mst_name}</Text>
                </View>
              </View>
  
              <View style={{flexDirection:"row",marginTop:5,marginLeft:5}}>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{color:'#000',fontWeight: 'bold',justifyContent: 'flex-start'}} >Title :</Text>
                </View>
                <View style={{flex:4}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.emp_mst_title}</Text>
                </View>
              </View>
  
  
            </View>
          )
        }else if (textvalue == 'Cost Center') {
  
          return (
            <View style={styles.dropdown_style}>
  
                <View style={{flexDirection:"row",marginTop:5,marginLeft:5}}>
                  <View style={{flex:1}}>
                      <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Cost Center :</Text>
                  </View>
                  <View style={{flex:2}}>
                      <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#2962FF'}} >{item.costcenter}</Text>
                  </View>
                </View>
  
                <View style={{flexDirection:"row",marginTop:5,marginLeft:5}}>
                  <View style={{flex:1}}>
                      <Text placeholder="Test" style={{color:'#000',fontWeight: 'bold',justifyContent: 'flex-start'}} >Desc :</Text>
                  </View>
                  <View style={{flex:2}}>
                      <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.descs}</Text>
                  </View>
                </View>
            </View>
          )
        }else if (textvalue == 'Asset Status') {
  
          return (
            <View style={styles.dropdown_style}>
  
                <View style={{flexDirection:"row",marginTop:5,marginLeft:5}}>
                  <View style={{flex:1}}>
                      <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Status :</Text>
                  </View>
                  <View style={{flex:4}}>
                      <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#2962FF'}} >{item.ast_sts_status}</Text>
                  </View>
                </View>
  
                <View style={{flexDirection:"row",marginTop:5,marginLeft:5}}>
                  <View style={{flex:1}}>
                      <Text placeholder="Test" style={{color:'#000',fontWeight: 'bold',justifyContent: 'flex-start'}} >Desc :</Text>
                  </View>
                  <View style={{flex:4}}>
                      <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.ast_sts_desc}</Text>
                  </View>
                </View>
            </View>
          )
        }else if(textvalue == 'Asset Type'){
          return (
            <View style={styles.dropdown_style}>
                <View style={{flexDirection:"row",marginTop:5,marginLeft:5}}>
                  <View style={{flex:1}}>
                      <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Type :</Text>
                  </View>
                  <View style={{flex:5}}>
                      <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#2962FF'}} >{item.ast_type_cd}</Text>
                  </View>
                </View>
  
                <View style={{flexDirection:"row",marginTop:5,marginLeft:5}}>
                  <View style={{flex:1}}>
                      <Text placeholder="Test" style={{color:'#000',fontWeight: 'bold',justifyContent: 'flex-start'}} >Desc :</Text>
                  </View>
                  <View style={{flex:5}}>
                      <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.ast_type_descs}</Text>
                  </View>
                </View>
            </View>   
          )
        }
      }
  
      //ASSET LIST
      const ItemView = ({ item }) => {
        return (
            
            <TouchableOpacity onPress={() => getItem(item)}>
                {renderText(item)}
            </TouchableOpacity>   
    
            
        );
      };
  
      const ItemSeparatorView = () => {
      return (
          // Flat List Item Separator
          <View
          style={{
            height: 0.5,
            width: '100%',
            backgroundColor: '#C8C8C8',
          }}
      />
      );
      };
  
      //SELECT ITEM ASSET LIST
      const getItem = (item) => {
      // Function for click on an item
      //alert('Id : ' + JSON.stringify(item) );
  
        if(textvalue == 'Work Area'){
  
          onChangeWorkArea_label(item.key +':'+item.label)
        }else if (textvalue == 'Asset Group Code'){
          onChangeAssetGroupCode_label(item.label)
        }else if (textvalue == 'Asset Location'){
          onChangeAssetLocation_label(item.label)
  
        }else if (textvalue == 'Created By'){
          setEmployee_Key(item.emp_mst_empl_id+' : '+item.emp_mst_name )
  
        }
  
        
  
        setSearch('');
        setmodalVisible(!modalVisible);
  
      
      
      };

  return (
    <View>
       <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={()=>{
                Alert.alert("Closed")
                setmodalVisible(!modalVisible)
        }}>             
            <View style={styles.model_cardview}>

                <View style={{flex:1,margin:20,backgroundColor:'#FFFFFF'}}>

                    <View style={{flexDirection:'row',alignItems:'center',height:50}}>
                        <Text style={{flex:1,fontSize:15, justifyContent:'center',textAlign:'center',color:'#000',fontWeight: 'bold'}}>{textvalue}</Text> 
                        <Ionicons 
                            name="close"
                            color='red'
                            size={30}
                            style={{marginEnd:15}}
                            onPress={()=>setmodalVisible(!modalVisible)}
                        />                        
                    </View>

                    <SearchBar
                        lightTheme
                        round
                        inputStyle={{color:'#000'}}
                        inputContainerStyle={{backgroundColor: '#FFFF'}}
                        searchIcon={{ size: 24 }}
                        onChangeText={(text) => searchFilterFunction(text)}
                        onClear={(text) => searchFilterFunction('')}
                        placeholder="Search here..."
                        value={search}
                    />

                    <FlatList
                        data={filteredDataSource}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator ={false}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={ItemSeparatorView}
                        renderItem={ItemView}
                        refreshControl={
                          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />

                </View>

            </View>

        </Modal>
    </View>
  )
}



const styles = StyleSheet.create({
  
    model_cardview:{

      flex:1,
      marginTop:50,
      backgroundColor:'rgba(0,0,0,0.8)'

  },

  });
