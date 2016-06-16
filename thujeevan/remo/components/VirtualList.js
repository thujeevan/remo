import React from 'react';
import { InfiniteLoader, VirtualScroll, AutoSizer, WindowScroller } from 'react-virtualized';

const VirtualList = (props) => {
    const {
        hasNextPage, 
        isNextPageLoading, 
        list, 
        loadNextPage, 
        rowRenderer, 
        rowHeight
    } = props;
    
    const rowCount = hasNextPage ? list.size + 1 : list.size;
    const loadMoreRows = isNextPageLoading ? () => {} : loadNextPage;
    const isRowLoaded = ({index}) => {
        return !hasNextPage || index < list.size;
    };
    
    const renderRow = ({index, isScrolling}) => {
        const row = list.get(index);
        const isLoading = !isRowLoaded({index});
        return rowRenderer(row, isLoading, isScrolling);
    }
    
    return (
        <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={rowCount}>
            {({onRowsRendered, registerChild}) => (
                <WindowScroller>
                    {({height, scrollTop}) => (
                        <AutoSizer disableHeight>
                            {({width}) => (
                                <VirtualScroll
                                    autoHeight
                                    ref={registerChild}
                                    width={width}
                                    height={height}
                                    onRowsRendered={onRowsRendered}
                                    rowRenderer={renderRow}
                                    rowCount={rowCount}
                                    rowHeight={rowHeight || 64}
                                    scrollTop={scrollTop}
                                />
                            )}
                        </AutoSizer>    
                    )}
                </WindowScroller>                       
            )}
        </InfiniteLoader>
    );
};

export default VirtualList;