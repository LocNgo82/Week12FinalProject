// customer class creates the customer's name and his or her orders using an array.
class Customer {
    constructor(name) {
        this.name = name;
        this.items = [];    
    }
    
}

// item class stores the name of the item, the cost, and the quantity.
class Item {
    constructor(name, cost, quantity) {
        this.name = name;
        this.cost = cost;
        this.quantity = quantity;
    }
}

// customer service class allows the user to post, get, update, delete from the server using Jquery and Ajax.
class CustomerService {                                    
    // I use mock API to store the customer data.
    static url = "https://63540cf4ccce2f8c020237cf.mockapi.io/Promineo_Tech_API/invoices";

    // getAllCustomers function will get all customers data from the server.
    static getAllCustomers() {
        return $.get(this.url);
    }

    // createCustomer function will create a new customer
    static createCustomer(Customer) {
        return $.post(this.url, Customer);        
    }


    // updateCustomer function will update the items after add or delete items from the array
    static updateCustomer(Customer) {
        return $.ajax({
            url: this.url + `/${Customer.id}`,
            dataType: 'json',
            data: JSON.stringify(Customer),
            contentType: 'application/json',
            type: 'PUT'
           
        });
    }

    // deleteCustomer will remove a customer from the data
    static deleteCustomer(id) {
        return $.ajax({
            url: this.url + `/${id}`,   
            type: 'DELETE'
           
        });
    }
}

// DOM manager class allows users to interact with the webpage and then send or retrieve data from the server,
// and display the data on the browser.
class DOMManager {
    static Customers;

    // getAllCustomers calls the CustomerService class to retrieve all the customers from the server
    // and then displays the customer data on the webpage.
    static getAllCustomers() {
        CustomerService.getAllCustomers().then(Customers => this.render(Customers));
    }

    // createCustomer calls the CustomerService class to create a new customer and save it to the server,
    // and then display all the customers on the webpage.
    static createCustomer(name) {
        
        CustomerService.createCustomer(new Customer(name))
        .then(() => {
            return CustomerService.getAllCustomers();
        })
        .then((Customers) => this.render(Customers));
    }

    // deleteCustomer calls the CustomerService class to delete a customer from server,
    // and then display all the remaining customers on the webpage.
    static deleteCustomer(id) {
        CustomerService.deleteCustomer(id) 
        .then( () => {
            return CustomerService.getAllCustomers();
        })
        .then((Customers) => this.render(Customers));
    }

    // addItem function adds an item to an existing customer, update the customer on the server,
    // and then display all the customers on the webpage.
    static addItem(id) {
        for (let customer of this.Customers) {
            if (customer.id == id) {     
                let name = $(`#${customer.id}-item-name`).val();
                let cost = $(`#${customer.id}-item-cost`).val();
                let quantity = $(`#${customer.id}-item-quantity`).val();
                customer.items.push(new Item(name, cost, quantity));
                CustomerService.updateCustomer(customer)
                .then(() => {
                    return CustomerService.getAllCustomers();
                })
                .then((Customers) => this.render(Customers));
            }
        }
    }

    // deleteitem function deletes an item of an existing customer, updates the customer on the server,
    // and then displays all the customers on the webpage.
    static deleteitem(CustomerId, itemNumber) {
        for (let customer of this.Customers) {
            if (customer.id == CustomerId) {
                
                customer.items.splice(itemNumber,1);
                CustomerService.updateCustomer(customer)
                        .then(() => {
                            return CustomerService.getAllCustomers();
                        })
                        .then((Customers) => this.render(Customers));                                
            }
        }
    }

    // render function uses jquery to dynamically display customer data on the webpage.  It uses bootstrap to 
    // format the customer data on the webpage.
    static render(Customers) {
        this.Customers = Customers;
        $('#app').empty();
        // the for loop go through all the customers one at a time and display the orders
        // on the webpage.
        for (let Customer of Customers) {
            // set up the input box to allow users to enter the item name, cost, and quantity            
            $('#app').prepend(
                `<div id="${Customer.id}" class="card">
                <div class="card-header">
                    <h2>${Customer.name}-${Customer.id}</h2>
                    <button class="btn btn-danger" onclick="DOMManager.deleteCustomer('${Customer.id}')">Delete</button>
                </div>
                <div class="card-body">
                    <div class="card">
                        <div class="row">                        
                            <div class="col-sm">
                                <input type="text" id="${Customer.id}-item-name" class="form-control" placeholder="item Name">
                            </div>
                            <div class="col-sm">
                                <input type="text" id="${Customer.id}-item-cost" class="form-control" placeholder="item cost">
                            </div>
                            <div class="col-sm">
                                <input type="text" id="${Customer.id}-item-quantity" class="form-control" placeholder="item quantity">
                            </div>
                        </div>
                        <button id="${Customer.id}-new-item" onclick="DOMManager.addItem('${Customer.id}')"
                                class="btn btn-primary form-control">Add</button>
                    </div>
    
                </div>
            </div><br>
             `
            );
            
            // display the table header when the customer has more than one order.
            if (Customer.items.length > 0) {
            $(`#${Customer.id}`).find('.card-body').append(
            `<p>
                <div class="card">
                    <div class="row">                        
                            <div class="col-sm">
                            <span><strong>Item#: </strong></span>
                            </div>
                            <div class="col-sm">
                            <span"><strong>Name: </strong> </span>
                            </div>
                            <div class="col-sm">
                            <span ><strong>cost: </strong> </span>
                            </div>
                            <div class="col-sm">
                            <span ><strong>quantity: </strong> </span>
                            </div>
                            <div class="col-sm">
                            <span ><strong>Subtotal: </strong></span>
                            </div>
                            <div class="col-sm">
                            
                            </div>
                            
                        </div>

                </div>
                </p>`);
            
                // as the program go through the list of orders, also calculate the subtotal for each item,
                // and then calculate the total for the entire order at the end.
            let count = 1;  // I also use count as the item id 
            let total = 0;
            for (let item of Customer.items) {
                // calculate the subotal 
                let subtotal = item.cost * item.quantity;
                // calculate the running total 
                total += subtotal;
                // use jquery to create the line item on the webpage.
                $(`#${Customer.id}`).find('.card-body').append(
                    `<p>
                    <div class="card">
                    <div class="row">                        
                            <div class="col-sm">
                            <span>${count}</span>
                            </div>
                            <div class="col-sm">
                            <span id="name-${count}">${item.name}</span>
                            </div>
                            <div class="col-sm">
                            <span id="cost-${count}">${item.cost}</span>
                            </div>
                            <div class="col-sm">
                            <span id="quantity-${count}">${item.quantity}</span>
                            </div>
                            <div class="col-sm">
                            <span id="subtotal-${count}">${subtotal}</span>
                            </div>
                            <div class="col-sm">
                            <button class="btn btn-danger" onclick="DOMManager.deleteitem('${Customer.id}', '${count-1}')">
                                Delete item</button>
                            </div>
                            
                        </div>

                    </div>
                    </p>
                    `
                )
                // increment the count after each item
                count++;
            }
            // display the total of the order
            $(`#${Customer.id}`).find('.card-body').append(
            `<p>
            <div class="card">
            <div class="row">                        
                    <div class="col-sm">
                
                    </div>
                    <div class="col-sm">
                    
                    </div>
                    <div class="col-sm">
                    
                    </div>
                    <div class="col-sm">
                    <span "><strong>Total: </strong> </span>
                    </div>
                    <div class="col-sm">
                    <span ><strong>${total} </strong></span>
                    </div>
                    <div class="col-sm">
                    
                    </div>
                    
                </div>

            </div>
            </p>`
            );
            
            }
        }
    }
}

// add an event listerner to the create button for the new customer.
$("#create-new-customer").on( "click", function() {
    console.log("click");
    let name = $('#new-customer-name').val();
    DOMManager.createCustomer($('#new-customer-name').val());
    $('#new-customer-name').val('');
  });


// display the webpage.
DOMManager.getAllCustomers();

