import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: User[];
  ready = false;

  userListSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userListSubscription = this.authService.getUsers().subscribe(
      (res: any) => {
        if (res.data) {
          const data: any[] = res.data;
          this.users = data.map((v: any) => {
            return {
              id: v.id,
              firstname: v.nombre,
              lastname: v.apellido,
              username: v.username,
              hash: v.password,
            };
          });
        }
        this.ready = true;
      },
      err => {
        const message = err.message || 'Error al cargar los usuarios';
        alert(message);
      }
    );
  }

  onDownload() {
    let content = 'Id | Nombre | Apellido | Usuario | Hash |';

    this.users.forEach(user => {
      content += `\n${user.id} | ${user.firstname} | ${user.lastname} | ${
        user.username
      } | ${user.hash} |`;
    });

    const blob = new Blob([content], {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(blob, 'users.txt');
  }
}
