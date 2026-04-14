class User {
    token = '';
    userDetails = {};
  static userDetails: any;
  static token: any;

 
 public set Token(token : string) {
    this. token = token;
 }

 
 public set UserDetails(user :any) {
    this. userDetails= user;
 }

 
 public get Token() : string {
    return this.token;
 }

 
 public get UserDetails() : any {
    return this.userDetails;
 };


}

export default User;