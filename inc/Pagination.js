let conn = require('./db');

class Pagination {
    constructor(
        query,
        params = [],
        itemPerPage = 10
    ) {
        this.query = query;
        this.params = params;
        this.itemPerPage = itemPerPage;
        this.currentPage = 1;
    }

    getPage(page = 1) {
        this.currentPage = page -1;

        return new Promise((resolve, reject) => {
            this.params.push(this.currentPage * this.itemPerPage, this.itemPerPage);
            conn.query([this.query, 'SELECT FOUND_ROWS() AS FOUND_ROWS'].join(';'), this.params, (err, results) => {

                if (err) {
                    reject(err);
                } else {
                    this.data = results[0];
                    this.total = results[1][0].FOUND_ROWS;
                    this.pagesTotal = Math.ceil(this.total / this.itemPerPage);   //Math.ceil arredonda para cima
                    this.currentPage++;
                    resolve(this.data);
                }
            });
        });
    }

    getTotal() {
        return this.total;
    }

    getCurrentPage() {
        return this.currentPage;
    }

    getTotalPages() {
        return this.pagesTotal;
    }

    getQueryString(obj) {
        let params = [];
        for (let name in obj) {
            params.push(`${name}=${obj[name]}`);
        }    
        return params.join('&');
    }
    
    getNavigation(params) {
        let limitPagesNav = 5;
        let links = [];
        let start = 0;
        let end = 0;

        if (this.getTotalPages() < limitPagesNav) limitPagesNav = this.getTotalPages();

        //  Se estamos nas primeiras páginas
        if ((this.getCurrentPage() - parseInt(limitPagesNav / 2)) < 1) {
            start = 1;
            end = limitPagesNav;
        //  Estamos chegando nas últimas páginas
        } else if ((this.getCurrentPage() + parseInt(limitPagesNav / 2)) > this.getTotalPages()) {
            start = this.getTotalPages() - limitPagesNav;
            end = this.getTotalPages();
        } else {
        // Estamos no meio da navegação das páginas
            start = this.getCurrentPage() - parseInt(limitPagesNav / 2);
            end = this.getCurrentPage() + parseInt(limitPagesNav / 2);
        }

        if (this.getCurrentPage() > 1) {
            links.push({
                text: '«',
                href: '?' + this.getQueryString(Object.assign({}, params, {
                    page: this.getCurrentPage() -1
                }))
            });
        }

        for (let x = start; x <= end; x++) {
            links.push({
                text: x,
                href: '?' + this.getQueryString(Object.assign({}, params, {
                    page: x
                })),
                active: (x === this.getCurrentPage())
            });
        }

        if (this.getCurrentPage() < this.getTotalPages()) {
            links.push({
                text: '»',
                href: '?' + this.getQueryString(Object.assign({}, params, {
                    page: this.getCurrentPage() + 1
                }))
            });
        }       
    
    return links;

    }


}


module.exports = Pagination;

/*




    /*
    getNavigation(params) {

        let limitPagesNav = 5;
        let links = [];

        if (this.getTotalPages() > limitPagesNav && this.getCurrentPage() > 1) {

            let queryString = this.getQueryString(Object.assign({}, params, {
                page: this.getCurrentPage() - 1
            }));

            links.push({
                href: `?${queryString}`,
                text: '«'
            });

        }

        let i = 0;
        let page;
        let startPageNav = (this.getTotalPages() < limitPagesNav) ? 1 : this.getCurrentPage();
        let previewTotalPagesNav = this.getTotalPages() - (startPageNav - 1);

        if (previewTotalPagesNav < limitPagesNav) {
            startPageNav = startPageNav - (limitPagesNav - previewTotalPagesNav);
        }

        if (startPageNav < 0) startPageNav = 1;

        while (i < limitPagesNav) {

            page = startPageNav + i;

            if (page > this.getTotalPages()) {
                break;
            }

            let queryString = this.getQueryString(Object.assign({}, params, { 
                page
            }));

            links.push({
                href: `?${queryString}`,
                text: page,
                active: (page === this.getCurrentPage())
            });

            i++;

        }

        if (this.getCurrentPage() < this.getTotalPages()) {

            let queryString = this.getQueryString(Object.assign({}, params, {
                page: this.getCurrentPage() + 1
            }));

            links.push({
                href: `?${queryString}`,
                text: '»'
            });

        }

        return links;

    }
    */
