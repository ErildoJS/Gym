const fs = require('fs')
const data = require('../data.json')
const {date} = require('../util')

exports.index = (req, res) => {
    return res.render('members/index', {members: data.members})
    
}

exports.show = (req, res) => {
    const {id} = req.params

    const foundMember = data.members.find((member) => {
        return id == member.id
    })

    if(!foundMember) return res.send("member not found")


    const member = {
        ...foundMember,
        birth: date(foundMember.birth).birthDay
    }

    return res.render("members/show", {member})
}

exports.create = (req, res) => {
    return res.render('members/create')
}


exports.post = (req, res) => {
    const keys = Object.keys(req.body)

    for( key of keys) {
        if(req.body[key] == "") {
            res.send('please fill all fields')
        }
    }


    birth = Date.parse(req.body.birth)

    let id = 1

    const lastMember = data.members[data.members.length - 1]
    if(lastMember) {
        id = lastMember.id + 1
    } 


    data.members.push({
        id,

        ...req.body,
        birth
        
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if (err) return send('write file error')

        return res.redirect(`/members/${id}`)
    })



    //return res.send(req.body)
}

exports.edit = (req, res) => {
    const {id} = req.params

    const foundMember = data.members.find((member) => {
        return id == member.id
    })

    if(!foundMember) return res.send("member not found")

    const member = {
        ...foundMember,
        birth: date(foundMember.birth).iso

    }

    return res.render('members/edit', {member})
}

exports.put = (req, res) => {
    const {id} = req.body
    let index = 0

    const foundMember = data.members.find((member, foundIndex) => {
        if(id == member.id) {
            index = foundIndex
            return true
        }
    })

    if(!foundMember) return res.send("member not found")

    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)

    }
    data.members[index] = member

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if(err) return res.send("write error")

        return res.redirect(`/members/${id}`)
    })
}

exports.delete = (req, res) => {
    const {id} = req.body

    const filteredMembers = data.members.filter(function(member) {
        return member.id != id

    })

    data.member = filteredMembers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if(err) return res.send("write file error")

        return res.redirect("/members")
    })
}