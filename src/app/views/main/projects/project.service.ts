import { IUser } from './../../../interfaces/auth.interface';
import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICreateProject, IProject } from 'src/app/interfaces/project.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  addProject(project: ICreateProject, files: File[]): Observable<IProject> {
    const formData = new FormData();
    formData.append('name', project.name);
    formData.append('description', project.description);
    files.forEach((file) => formData.append('files', file, file.name));
    console.log(project.users)
    project.users.forEach((user) => formData.append('userList', user.username))

    return this.http.post<IProject>(
      `${environment.baseUrl}/api/v1/projects/`,
      formData
    );
  }

  listProjects(): Observable<IProject[]> {
    return this.http.get<IProject[]>(`${environment.baseUrl}/api/v1/projects/`);
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/api/v1/projects/${id}`);
  }

  inviteUser(username: string): void {
    this.http.post(`${environment.baseUrl}/api/v1/groups/addUser`, 
    {
      username: username,
      groupId: '1',
    });
  }

  getOneProject(id: string): Observable<IProject> {
    return this.http.get<IProject>(`${environment.baseUrl}/api/v1/projects/${id}`);
  }

  getOneProjectByPipeline(id: string): Observable<IProject> {
    return this.http.get<IProject>(`${environment.baseUrl}/api/v1/projects/pipelines/${id}`);
  }

  getAllUserByNameOrEmail(nameOrEmail: String): Observable<IUser[]>{
    return this.http.get<IUser[]>(`${environment.baseUrl}/UsersByUsernameOrName/${nameOrEmail}`);
  }

  getAllPendingOrAcceptedUsersInProject(id: string): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${environment.baseUrl}/api/v1/projects/${id}/users`);
  }

  saveEdit(project: IProject): Observable<IProject> {
    console.log(project.users)
    return this.http.put<IProject>(
      `${environment.baseUrl}/api/v1/projects/${project.id}`,
      {
        name: project.name,
        description: project.description,
        usersId: project.users.map(user => user.id)
      },
      
    );
  }
}
