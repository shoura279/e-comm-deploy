export class ApiFeature {
    constructor(mongooseQuery, queryDate) {
        this.mongooseQuery = mongooseQuery
        this.queryDate = queryDate
    }

    // pagination
    pagination() {
        let { page, size } = this.queryDate
        if (!page || page <= 0) {
            page = 1
        }
        if (!size || size <= 0) {
            size = 3
        }
        size = parseInt(size)
        page = parseInt(page)// 1.6 >> 1
        const skip = (page - 1) * size
        this.mongooseQuery = this.mongooseQuery.limit(size).skip(skip)// Product.find()
        return this
    }

    // sort
    sort() {
        let { sort } = this.queryDate
        sort = sort?.replaceAll(',', ' ')
        this.mongooseQuery = this.mongooseQuery.sort(sort)
        return this
    }

    // select
    select() {
        let { select } = this.queryDate
        select = select?.replaceAll(',', ' ')
        this.mongooseQuery = this.mongooseQuery.select(select)
        return this
    }

    filter() {
        let { page, size, sort, select, ...filter } = this.queryDate
        filter = JSON.parse(JSON.stringify(filter).replace(/gt|gte|lt|lte/g, match => `$${match}`))
        this.mongooseQuery = this.mongooseQuery.find(filter)

        // this.queryDate.metaData.size = this.mongooseQuery.countDocuments(filter)
        // this.queryDate.metaData.page = this.queryDate.page
        
        return this

    }
}