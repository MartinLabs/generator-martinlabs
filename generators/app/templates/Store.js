class AdapStore {
    constructor(defaultColumn, callback) {
        this.orderBy = defaultColumn;
        this.callback = callback;
        this.asc = true;
        this.count = 0;
        this.currentPage = 0;
        this.pageCount = 0;
        this.pageSize = 20;
        this.query = "";
        
        this.searchByQuery = this.debounce(this._searchByQuery, 500);
    }
    
    setOrder(column, asc) {
        
        if (asc != null) {
            this.asc = asc;
        } else if (this.orderBy == column) {
            this.asc = !this.asc;
        } else {
            this.asc = true;
        }
        
        this.orderBy = column;
        this.currentPage = 0;
        this.search();
    }
    
    setCount(count) {
        this.count = count;
        if (this.pageSize) {
            this.pageCount = Math.floor(this.count / this.pageSize);
        }
    }
    
    setCurrentPage(page) {
        this.currentPage = page;
        this.search();
    }
    
    setPageSize(pageSize) {
        this.pageSize = pageSize;
        if (this.pageSize) {
            this.currentPage = 0;
            this.pageCount = Math.floor(this.count / this.pageSize);
            this.search();
        }
    }
    
    previousPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.search();
        }
    }
    
    nextPage() {
        if (this.currentPage < this.pageCount) {
            this.currentPage++;
            this.search();
        }
    }
    
    _searchByQuery() {
        if (!this.query || !this.query.length || this.query.length > 2) {
            this.currentPage = 0;
            this.search();
        }
    }
    
    search() {
        if (this.callback && !this.callingBack) {
            this.callingBack = true;
            this.callback({
                query: this.query,
                page: this.currentPage,
                limit: this.pageSize,
                orderBy: this.orderBy,
                ascending: this.asc
            });
            this.callingBack = false;
        }
    }
    
    debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
    }
    
}

export { AdapStore as default }