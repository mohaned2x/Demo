import { Component } from '@angular/core';
import { MContainerComponent } from '../../m-framework/m-container/m-container.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { MTableComponent } from '../../m-framework/m-table/m-table.component';
class Item{
  id: string;
  val1: string;
  val2: string;
  constructor(mKey: string, mVal1: string, mVal2: string){
    this.id = mKey;
    this.val1 = mVal1;
    this.val2 = mVal2;
  }
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MContainerComponent, MTableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
  anItem: Item;
  items: Item[];
  constructor(private firebaseService: FirebaseService){
    this.anItem = new Item("","","");
    this.items = [];
  }
  getItemWithKey(key: string){
  this.firebaseService.readObject("/", key).then((data:any)=>{
    this.anItem = data;
  })
  }
  getListWithKey(key: string){
    this.items = [];
    this.firebaseService.getDataContinuosly(key).subscribe((data)=>{
      this.handleIncomingData(data);
    })
  }
  handleIncomingData(data: any){
    this.items = [];
    if (data && typeof data === 'object') {
      let keys = Object.keys(data);
      let values = Object.values(data);
      for(let i=0;i<Object.keys(data).length;i++){
        let key = keys[i];
        let vals:any = values[i];
        let item = new Item (key, vals.val1, vals.val2)
        this.items.push(item);
      }
  }
  }
  storeItemWithKey(key: string){
    if(this.anItem != null){
      this.anItem = new Item (key, this.anItem.val1, this.anItem.val2);
      this.firebaseService.createObject("/"+key, this.anItem);
    }
  }
  addItemToList(){
  if(this.anItem != null && this.items != null){
    let object = {val1: this.anItem.val1, val2:this.anItem.val2};
    let key = this.firebaseService.addToList("items",object)!;
    this.items.push(new Item(key, this.anItem.val1, this.anItem.val2));
  }
  }
  
  removeItemFromList(itemId: number){
    let index = 0;
    for(let i = 0;i<this.items.length;i++){
      if(this.items[i].id == itemId.toString())
        index = i;
    }
    this.items.splice(index,1);
    this.firebaseService.removeFromList("items",itemId.toString());
  }
  clearAllItems(){
    this.items = [];
    this.anItem = new Item("","","");
    this.firebaseService.reset();
  }
 
  
  }
  