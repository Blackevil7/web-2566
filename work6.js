const RB = ReactBootstrap;
const { Alert, Card, Button, Table } = ReactBootstrap;


class App extends React.Component {
    title = (
        <Alert variant="info">
            <b>Work6 :</b> Firebase
        </Alert>
    );
    footer = (
        <div>
            By 643020400-2 พีรพล ลุนหงส์ <br />
            College of Computing, Khon Kaen University <br />
            <Button className={'mx-2 mb-3'} href={'index.html'}>Home Page</Button>
        </div>
    );
    state = {
        scene: 0,
        students: [],
        stdid: "",
        stdtitle: "",
        stdfname: "",
        stdlname: "",
        stdemail: "",
        stdphone: "",
    }

    render() {
        // var stext = JSON.stringify(this.state.students);  
        return (
            <Card>
                <Card.Header>{this.title}</Card.Header>
                <Card.Body>
                    <Button className={'mx-2 mb-3'} onClick={() => this.readData()}>Read Data</Button>
                    <Button className={'mx-2 mb-3'} onClick={() => this.autoRead()}>Auto Read</Button>
                    <div>
                        <StudentTable className={'table table-striped'} data={this.state.students} app={this} />
                    </div>
                </Card.Body>
                <Card.Footer>
                    <b>เพิ่ม/แก้ไขข้อมูล นักศึกษา :</b><br />
                    <TextInput label="ID" app={this} value="stdid" style={{ width: 150 }} />
                    <TextInput label="คำนำหน้า" app={this} value="stdtitle" style={{ width: 100 }} />
                    <TextInput label="ชื่อ" app={this} value="stdfname" style={{ width: 120 }} />
                    <TextInput label="สกุล" app={this} value="stdlname" style={{ width: 120 }} />
                    <TextInput label="Email" app={this} value="stdemail" style={{ width: 200 }} />
                    <TextInput label="Phone" app={this} value="stdphone" style={{ width: 120 }} />
                    <Button className={'mx-2'} onClick={() => this.insertData()}>Save</Button>
                </Card.Footer>
                <Card.Footer>{this.footer}</Card.Footer>
            </Card>
        );
    }

    readData() {
        db.collection("students").get().then((querySnapshot) => {
            var stdlist = [];
            querySnapshot.forEach((doc) => {
                stdlist.push({ id: doc.id, ...doc.data() });
            });
            console.log(stdlist);
            this.setState({ students: stdlist });
        });
    }

    autoRead() {
        db.collection("students").onSnapshot((querySnapshot) => {
            var stdlist = [];
            querySnapshot.forEach((doc) => {
                stdlist.push({ id: doc.id, ...doc.data() });
            });
            this.setState({ students: stdlist });
        });
    }

    insertData() {
        db.collection("students").doc(this.state.stdid).set({
            title: this.state.stdtitle,
            fname: this.state.stdfname,
            lname: this.state.stdlname,
            phone: this.state.stdphone,
            email: this.state.stdemail,
        });
    }

    edit(std) {
        this.setState({
            stdid: std.id,
            stdtitle: std.title,
            stdfname: std.fname,
            stdlname: std.lname,
            stdemail: std.email,
            stdphone: std.phone,
        })
    }

    delete(std) {
        if (confirm("ต้องการลบข้อมูล")) {
            db.collection("students").doc(std.id).delete();
        }
    }
}

function StudentTable({ data, app }) {
    return <table className='table bg-balck'>
        <tr>
            <td>รหัส</td>
            <td>คำนำหน้า</td>
            <td>ชื่อ</td>
            <td>สกุล</td>
            <td>email</td>
            <td>phone</td>
        </tr>
        {
            data.map((s) => <tr>
                <td>{s.id}</td>
                <td>{s.title}</td>
                <td>{s.fname}</td>
                <td>{s.lname}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td><EditButton std={s} app={app} /></td>
                <td><DeleteButton std={s} app={app} /></td>
            </tr>)
        }
    </table>
}

function TextInput({ label, app, value, style }) {
    return <label className="form-label me-3">
        {label}:
        <input className="form-control" style={style}
            value={app.state[value]} onChange={(ev) => {
                var s = {};
                s[value] = ev.target.value;
                app.setState(s)
            }
            }></input>
    </label>;
}

function EditButton({ std, app }) {
    return <button class="mx-2 bg-primary border border-primary text-white rounded-3" onClick={() => app.edit(std)}>แก้ไข</button>
}

function DeleteButton({ std, app }) {
    return <button class="mx-2 bg-danger border border-danger text-white rounded-3" onClick={() => app.delete(std)}>ลบ</button>
}

const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />);

// ใช้ config จาก เว็บ Firebase: Project Setting 
const firebaseConfig = {
    apiKey: "AIzaSyC_V3EZDrGZb5ZB7cC-8vuZ-lRCWeF6UPk",
    authDomain: "web2566-2f7e6.firebaseapp.com",
    projectId: "web2566-2f7e6",
    storageBucket: "web2566-2f7e6.appspot.com",
    messagingSenderId: "846310583625",
    appId: "1:846310583625:web:fea7aa3329d8440f0a3e98",
    measurementId: "G-7K098Q9J3H"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
db.collection("students").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} =>`, doc.data());
    });
});
