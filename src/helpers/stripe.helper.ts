import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectStripe } from 'nestjs-stripe';
import { UserDocument } from "src/modules/user/schemas/user.schema";
import Stripe from 'stripe';

@Injectable()
export class StripeHelper {
  constructor(
    // @ts-ignore
    @InjectStripe() private readonly stripe: Stripe,
    private configService: ConfigService,
  ) {}

  /**
   * @Method createCustomer
   * @Description Creates a new customer in Stripe.
   */
  async createCustomer(name: string, email: string): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({
        name: name,
        email: email,
      });
      return customer;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @Method customerRetrieve
   * @Description Retrieve a new customer in Stripe.
   */
  async customerRetrieve(
    id: string,
  ): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
    try {
      return await this.stripe.customers.retrieve(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @Method paymentIntents
   * @Description Create a payment intent
   */
  async paymentIntents(
    customerId: string,
    amount: number,
    description: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        customer: customerId,
        description: description,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @Method stripeRefund
   * @Description Create a payment refund request
   */
  async stripeRefund(amount: number, chargeId: string): Promise<Stripe.Refund> {
    try {
      const refund = await this.stripe.refunds.create({
        charge: chargeId,
        amount: amount,
      });

      return refund;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @Method createTransfer
   * @Description Creates a transfer to a specified Stripe connected account.
   */
  async createTransfer(
    amount: number,
    stripeConnectId: string,
  ): Promise<Stripe.Transfer> {
    try {
      return await this.stripe.transfers.create({
        amount: amount,
        currency: 'usd',
        destination: stripeConnectId,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @Method createAccount
   * @Description Creates an account in Stripe.
   */
  async createAccount(
    email: string,
    loginUser: Partial<UserDocument>,
  ): Promise<Stripe.Account> {
    try {
      return await this.stripe.accounts.create({
        type: 'express',
        business_type: 'individual',
        // country: 'US',
        email: email,
        business_profile: {
          name: [loginUser.firstName, loginUser.lastName].join(' '),
          support_email: loginUser.email,
        },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: { user_id: loginUser._id?.toString() || "" },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @Method retrieveConnectedAccount
   * @Description Fetch Stripe Connect Account Details
   */
  async retrieveConnectedAccount(accountId: string): Promise<Stripe.Account> {
    try {
      return await this.stripe.accounts.retrieve(accountId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @Method createAccountLink
   * @Description Creates an account link for the specified account ID.
   */
  async createAccountLink(accountId: string): Promise<Stripe.AccountLink> {
    try {
      const urlQueryString = new URLSearchParams({ accountId });
      return await this.stripe.accountLinks.create({
        account: accountId,
        refresh_url: `${this.configService.get('BACKEND_BASE_URL')}api/vendor/stripe/connect/re-auth?${urlQueryString.toString()}`,
        return_url: `${this.configService.get('BACKEND_BASE_URL')}api/vendor/stripe/connect/return-url?${urlQueryString.toString()}`,
        type: 'account_onboarding',
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @Method createLoginLink
   * @Description Fetch Stripe Connect Account Details
   */
  async createLoginLink(accountId: string) {
    try {
      return await this.stripe.accounts.createLoginLink(accountId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @Method listExternalAccounts
   * @Description Lists external accounts associated with the provided Stripe Connect account ID.
   */
  async listExternalAccounts(
    stripeConnectId: string,
  ): Promise<Stripe.ApiList<Stripe.ExternalAccount>> {
    try {
      return await this.stripe.accounts.listExternalAccounts(stripeConnectId, {
        limit: 100,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @Method deleteExternalAccount
   * @Description Deletes the external account with the specified ID from the provided Stripe Connect account.
   */
  async deleteExternalAccount(
    stripeConnectId: string,
    accountId: string,
  ): Promise<Stripe.DeletedExternalAccount> {
    try {
      return await this.stripe.accounts.deleteExternalAccount(
        stripeConnectId,
        accountId,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @Method createExternalAccount
   * @Description Creates a new external account (e.g., bank account) for the provided Stripe Connect account.
   */
  async createExternalAccount(
    accountId: string,
    account_data:
      | Stripe.AccountCreateExternalAccountParams.Card
      | Stripe.AccountCreateExternalAccountParams.BankAccount,
  ): Promise<Stripe.ExternalAccount> {
    try {
      return await this.stripe.accounts.createExternalAccount(accountId, {
        external_account: account_data,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
