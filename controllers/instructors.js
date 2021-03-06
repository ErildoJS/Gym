const fs = require('fs')
const data = require('../data.json')
const {age, date} = require('../util')

exports.index = (req, res) => {
    return res.render('instructors/index', {instructors: data.instructors})
    
}

exports.show = (req, res) => {
    const {id} = req.params

    const foundInstructor = data.instructors.find((instructor) => {
        return id == instructor.id
    })

    if(!foundInstructor) return res.send("instructor not found")


    const instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","),
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundInstructor.created_at),
    }

    return res.render("instructors/show", {instructor})
}

exports.create = (req, res) => {
    return res.render('instructors/create')
}


exports.post = (req, res) => {
    const keys = Object.keys(req.body)

    for( key of keys) {
        if(req.body[key] == "") {
            res.send('please fill all fields')
        }
    }

    let {avatar_url, birth, name, services, gender} = req.body

    birth = Date.parse(birth)
    const created_at = Date.now()

    const id = Number(data.instructors.length + 1)


    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if (err) return send('write file error')

        return res.redirect(`/instructors/${id}`)
    })



    //return res.send(req.body)
}

exports.edit = (req, res) => {
    const {id} = req.params

    const foundInstructor = data.instructors.find((instructor) => {
        return id == instructor.id
    })

    if(!foundInstructor) return res.send("instructor not found")

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth).iso

    }

    

    return res.render('instructors/edit', {instructor})
}

exports.put = (req, res) => {
    const {id} = req.body
    let index = 0

    const foundInstructor = data.instructors.find((instructor, foundIndex) => {
        if(id == instructor.id) {
            index = foundIndex
            return true
        }
    })

    if(!foundInstructor) return res.send("instructor not found")

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)

    }
    data.instructors[index] = instructor

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if(err) return res.send("write error")

        return res.redirect(`/instructors/${id}`)
    })
}

exports.delete = (req, res) => {
    const {id} = req.body

    const filteredInstructors = data.instructors.filter(function(instructor) {
        return instructor.id != id

    })

    data.instructor = filteredInstructors

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if(err) return res.send("write file error")

        return res.redirect("/instructors")
    })
}