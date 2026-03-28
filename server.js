const e=require("express"),r=require("express-rate-limit"),c=require("crypto")
const a=e()
a.use(e.json())

const s={}

a.use(r({windowMs:5000,max:10,message:"Too many requests"}))

const ok=q=>{
    const u=q.headers["user-agent"]||""
    const h=q.headers["roblox-id"]||""
    return u.includes("Roblox")||h
}

a.use((q,w,n)=>ok(q)?n():w.status(403).send("Unauthorized"))

a.post("/api",(q,w)=>{
    if(!q.body.text)return w.status(400).send("No script")
    const i=c.randomBytes(6).toString("hex").toUpperCase()
    s[i]=q.body.text
    w.json({url:`https://yourdomain.onrender.com/${i}`})
})

a.get("/:i",(q,w)=>{
    const d=s[q.params.i]
    if(!d)return w.status(404).send("Not found")
    w.type("text/plain").send(d)
})

a.get("/",(q,w)=>w.sendFile(__dirname+"/index.html"))

a.listen(process.env.PORT||3000)
