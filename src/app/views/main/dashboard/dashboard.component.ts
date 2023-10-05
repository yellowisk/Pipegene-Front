import { GroupService } from './../projects/group.service';
import { ErrorMap } from './../../../enums/error-code.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from './../../../services/error.service';
import { ExecutionService } from './../executions/execution.service';
import { IExecution } from './../../../interfaces/execution.interface';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IGroupParticipation, IGroupParticipationView } from 'src/app/interfaces/group.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  today: string;
  username: string;
  executions: IExecution[] = [];
  allNotifications: IGroupParticipationView[] = [];
  options: any[] = [
    {
      name: 'Projetos',
      icon: 'far fa-folder-open',
      url: '/projects',
    },
    {
      name: 'Pipelines',
      icon: 'fas fa-stream',
      url: '/pipelines',
    },
    {
      name: 'Execuções',
      icon: 'fas fa-tasks',
      url: '/executions',
    },
    {
      name: 'Serviços',
      icon: 'fas fa-cogs',
      url: '/services',
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly executionService: ExecutionService,
    private readonly groupService: GroupService,
    private readonly errorService: ErrorService,
  ) {}

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username');
    this.getExecutions();
    this.getToday();
    this.getNotifications();
  }

  getExecutions(): any {
    this.executionService.listExecutions().subscribe(
      (response) => {
        this.executions = response;
      },
      (error: HttpErrorResponse) => {
        this.errorService.setError(ErrorMap.get('FAILED_TO_GET'));
      }
    );
  }

  getNotifications(): void {
    this.groupService.getAllGroupInvites().subscribe(
      (response) => {
        this.allNotifications = response
    }
    );
  }  

  acceptSolicitation(id: string): void {
    this.groupService.acceptGroupParticipation(id).subscribe
      (response => {
        console.log('Participation accepted successfully');
        location.reload();
      }, error => {
        console.error('Error accepting participation:', error);
      });
  } 

  denySolicitation(id: string): void {
    this.groupService.denyGroupParticipation(id).subscribe
    (response => {
      console.log('Participation deny successfully');
      location.reload();
    }, error => {
      console.error('Error accepting participation:', error);
    });
  }

  getToday(): void {
    const daysOfWeek = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ];
    const date = new Date();
    this.today = `${daysOfWeek[date.getDay()]}`;
  }

  redirect(path: string): void {
    this.router.navigate([path]);
  }
}
