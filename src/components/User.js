class User {
    constructor(user_fname, user_lname, user_tel) {
        this.user_fname = user_fname;
        this.user_lname = user_lname;
        this.user_tel = user_tel;
    }
    set_fname(user_fname) {
        this.user_fname = user_fname;

    }
    get_fname() {
        return this.user_fname
    }
    set_lname(user_lname) {
        this.user_lname = user_lname;

    }
    get_lname() {
        return this.user_lname
    }
    set_tel(user_tel) {
        this.user_tel = user_tel;

    }
    get_tel() {
        return this.user_tel
    }

    userprintInfo() {
        console.log('Firstname: ', this.get_fname());
        console.log('Lastname: ', this.get_lname());
        console.log('Tel: ', this.get_tel());
    }
}


export default User; 