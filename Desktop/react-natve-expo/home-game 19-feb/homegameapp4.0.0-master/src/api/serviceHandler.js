import React from 'react';
import { AsyncStorage, Animated } from "react-native";
import { postData } from './service';
import { ToastMessage } from '../components/ToastMessage';
import Global from '../../constants/Global';

export const getListContent = (api, params={}, that, type='first') => {
    
    let page = 1;
    if (!that.state.is_api_calling) {
        const { current_page } = that.state;
        if(type == 'refresh'){
            that.setState({refreshing:true, current_page: 1, listRecords:[]}); 
        }else if(type == 'first'){
            that.setState({ listRecords: [], current_page: 1 })
        }else{
            page = that.state.current_page;
        }

        if (page <= that.state.total_pages) {
            if(type == 'loadmore'){
                that.setState({ show_footer_loader: true })
            }
            params.page = page;
            that.setState({ is_api_calling: true });
            console.log(api)
            postData(api, params).then(async (res) => {
                //console.log(JSON.stringify(res))
                that.setState({ showIndicator: false});
                if (res.status) {
                    that.setState({ refreshing: false, is_api_calling: false, show_footer_loader: false })
                    if (res.data.length > 0) {
                        
                        let listRecords = that.state.listRecords.concat(res.data);
                        if(api == 'notifications'){
                            listRecords.map(o => o.rowTranslateAnimatedValues = new Animated.Value(1))
                            that.setState({initialList: listRecords})
                        }
                        

                        that.setState({ listRecords: listRecords, current_page: res.meta.current_page + 1, total_pages: res.meta.total_pages, show_no_record: false });
                    } else if (that.state.current_page >= 1 && that.state.listRecords.length == 0) {
                        that.setState({ show_no_record: true })
                    }
                } else {
                    ToastMessage(res.message, 'error')
                    that.setState({ refreshing: false, is_api_calling: false, show_footer_loader: false });

                }
            });
        } else {
            return { status: false, message: "No more page available" };
        }
    } else {
        return { status: false, message: "Api already in progerss" };
    }
}