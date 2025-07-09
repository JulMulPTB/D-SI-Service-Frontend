import {Component, OnInit, HostListener} from '@angular/core';
import {ParticipantsService} from "../../services/participants.service";
import {Participant} from "../../model/participant.model";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {catchError, map, Observable, of, startWith} from "rxjs";
import {AppDataState, DataStateEnum} from "../../state/participant.state";
import {Report} from "../../model/report.model";
import {Dcc} from "../../model/Dcc.model";


@Component({
  selector: 'app-dkeycomparison',
  templateUrl: './dkeycomparison.component.html',
  styleUrls: ['./dkeycomparison.component.css']
})
export class DkeycomparisonComponent implements OnInit {
  title = 'dsi-Services';
  public participants$?: Observable<AppDataState<Participant[]>>;
  public dccPidList$?: Observable<AppDataState<Dcc[]>>;
  participantFormGroup?: FormGroup; //"?" -> kann auch undefined sein. Ansonsten müsste die Variable deklariert werden
  readonly DataStateEnum = DataStateEnum;
  public reports$?: Observable<AppDataState<Report>>;
  reportFormGroup?: FormGroup<any>;
  searchText: any;
  selectedOption: string = "";

  //Login-Implementierung:
  showLogin = false;
  username = '';
  password = '';
  adminSignedIn = false;
  coordinatorSignedIn = false;

  //Navigation
  evaluateActive = true;
  dccListActive = false;
  userListActive = false;

  //DCC-List Admin
  showDccUpload = false;

  //Koordinator-Panel




  //Registierung
  showRegister = false;
  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    admin: false,
    active: false
  }

  constructor(private participantsService: ParticipantsService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.getParticipants();
    this.getDccList();
    this.participantFormGroup = this.fb.group({
        name: ["", Validators.required],
        pidDCC: ["", Validators.required]
      }
    )
    this.getReports();
    this.reportFormGroup = this.fb.group({
      pidReport: ["", Validators.required],
      smartStandardEvaluationMethod: ["", Validators.required]
    })
    this.clearParticipantsList();

  }

  public getParticipants(): void {
    this.participants$ = this.participantsService.getParticipants().pipe(
      map(data => ({dataState: DataStateEnum.LOADED, data: data})),
      startWith({dataState: DataStateEnum.LOADING}),
      catchError(err => of({dataState: DataStateEnum.ERROR, errorMessage: err.message}))
    );
  }

  public onDeleteParticipant(p: Participant) {
    if (confirm("Are you sure to delete " + p.name))
      this.participantsService.onDeleteParticipant(p.id).subscribe(data => {
        this.getParticipants();
      });
  }

  public clearParticipantsList() {
    this.participantsService.onDeleteAll().subscribe(data => {

    });
  }

  public addParticipant() {
    this.participantsService.addParticipant(this.participantFormGroup?.value)
      .subscribe(data => {
        this.getParticipants()
      });
    this.participantFormGroup?.reset();
    //sessionStorage.setItem('participnatsList', JSON.stringify( this.participantsService.getParticipants()))
  }

  public getReports(): void {

    this.reports$ = this.participantsService.getReports().pipe(
      map(data => ({dataState: DataStateEnum.LOADED, data: data})),
      startWith({dataState: DataStateEnum.LOADING}),
      catchError(err => of({dataState: DataStateEnum.ERROR, errorMessage: err.message}))
    );
  }

  public addReport() {
    this.participantsService.addReport(this.reportFormGroup?.value)
      .subscribe(data => {
        this.getReports()
        // alert("added successfully")
      });
    this.reportFormGroup?.reset({smartStandardEvaluationMethod: ""});
  }

  public onDownload(): any {
    this.addReport();
    this.participantsService.getPidReport();
    this.participantsService.download().subscribe(
      response => {
        let fileName = response.headers.get('Content-Disposition').split(';')[1].split('filename')[1].split('=')[1].trim();
        let blob: Blob = response.body as Blob;
        let a = document.createElement('a');
        console.log("file: ", fileName)
        a.download = fileName;
        a.href = window.URL.createObjectURL(blob);
        a.click();
      }
    );
    this.participantsService.getPidReport();
  }

  public getDccList(): void {
    this.dccPidList$ = this.participantsService.getDccList().pipe(
      map(data => ({dataState: DataStateEnum.LOADED, data: data})),
      startWith({dataState: DataStateEnum.LOADING}),
      catchError(err => of({dataState: DataStateEnum.ERROR, errorMessage: err.message}))
    );
  }

  selectedEvalMethod(e: any) {
    console.log("smartStandardEvaluationMethod: ", e.target.value)
  }

  //Anmeldung eines Nutzer
  onSubmit(){
    //Zum testweisen Laden des Admin-Panels über die GUI
    if (this.username === "admin" && this.password === "password"){
      this.adminSignedIn = true;
    }
    else if (this.username === "coordinator" && this.password === "password"){
      this.coordinatorSignedIn = true;
    }
    else {
      alert("Invalid username or password");
    }
    //Session-Start bzw. Laden des Nutzer-Panel

    //Login-Fenster schließen
    this.showLogin = false;
  }

  //Registrierung eines neuen Nutzers
  onRegisterSubmit(){
    console.log(this.registerData);
    //Server-Anfrage oder E-Mail-Versand auslösen
    this.showRegister = false;
  }

  //Logout User
  onLogout() {
    this.adminSignedIn = false;
    this.coordinatorSignedIn =false;
    this.evaluateActive = true;
    this.userListActive = false;
    this.dccListActive = false;
  }


  //Pop-Up über ESC schließen
  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.showLogin) {
      this.showLogin = false;
    }
    if (this.showRegister) {
      this.showRegister = false;
    }
  }


  onEvaluate() {
    this.evaluateActive = true;
    this.dccListActive = false;
    this.userListActive = false;
  }
  onDccList() {
    this.evaluateActive = false;
    this.dccListActive = true;
    this.userListActive = false;
  }

  onUserList() {
    this.evaluateActive = false;
    this.dccListActive = false;
    this.userListActive = true;
  }

  editDCC() {

  }

  deleteDCC() {

  }

  viewXML() {

  }

  onClosePopup() {

  }

  onUploadDcc() {

  }
}


