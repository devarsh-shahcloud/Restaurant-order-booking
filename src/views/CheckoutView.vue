<template>
  <div class="checkout-view">
    <div class="container mx-auto px-4 py-8">
      <div v-if="cartStore.isEmpty" class="text-center py-16">
        <span class="text-8xl mb-6 block">🛒</span>
        <h2 class="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p class="text-gray-600 mb-8">Add items to cart before checkout</p>
        <BaseButton size="lg" @click="router.push('/menu')">Browse Menu</BaseButton>
      </div>

      <div v-else class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-display font-bold mb-8">Checkout</h1>

        <div class="flex items-center justify-between mb-8">
          <div v-for="(stepName, index) in steps" :key="index" class="flex items-center flex-1">
            <div class="flex flex-col items-center flex-1">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                currentStep > index
                  ? 'bg-green-500 text-white'
                  : currentStep === index
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600',
              ]">
                {{ currentStep > index ? '✓' : index + 1 }}
              </div>
              <span class="text-xs mt-2 text-center">{{ stepName }}</span>
            </div>
            <div v-if="index < steps.length - 1"
              :class="['h-1 flex-1', currentStep > index ? 'bg-green-500' : 'bg-gray-200']"></div>
          </div>
        </div>

        <div class="card p-6 mb-6">
          <div v-if="currentStep === 0">
            <h2 class="text-xl font-semibold mb-6">Contact Information</h2>
            <div class="space-y-4">
              <div>
                <label class="block font-medium mb-2">Full Name *</label>
                <input v-model="formData.name" type="text" class="input-field"
                  :class="{ 'border-red-500': errors.name }" placeholder="John Doe" />
                <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
              </div>

              <div>
                <label class="block font-medium mb-2">Phone Number *</label>
                <input v-model="formData.phone" type="tel" class="input-field"
                  :class="{ 'border-red-500': errors.phone }" placeholder="1234567890" />
                <p v-if="errors.phone" class="text-red-600 text-sm mt-1">{{ errors.phone }}</p>
              </div>

              <div>
                <label class="block font-medium mb-2">Email *</label>
                <input v-model="formData.email" type="email" class="input-field"
                  :class="{ 'border-red-500': errors.email }" placeholder="john@example.com" />
                <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
              </div>
            </div>
          </div>

          <div v-if="currentStep === 1">
            <h2 class="text-xl font-semibold mb-6">Order Type</h2>
            <div class="grid grid-cols-2 gap-4">
              <button @click="formData.orderType = 'delivery'" :class="[
                'p-6 rounded-lg border-2 transition-all',
                formData.orderType === 'delivery'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300',
              ]">
                <span class="text-4xl mb-2 block">🚚</span>
                <h3 class="font-semibold">Delivery</h3>
              </button>

              <button @click="formData.orderType = 'pickup'" :class="[
                'p-6 rounded-lg border-2 transition-all',
                formData.orderType === 'pickup'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300',
              ]">
                <span class="text-4xl mb-2 block">🏪</span>
                <h3 class="font-semibold">Pickup</h3>
              </button>
            </div>
          </div>

          <div v-if="currentStep === 2">
            <div v-if="formData.orderType === 'delivery'">
              <h2 class="text-xl font-semibold mb-6">Delivery Address</h2>
              <div class="space-y-4">
                <div>
                  <label class="block font-medium mb-2">Street Address *</label>
                  <input v-model="formData.address" type="text" class="input-field"
                    :class="{ 'border-red-500': errors.address }" placeholder="123 Main St" />
                  <p v-if="errors.address" class="text-red-600 text-sm mt-1">
                    {{ errors.address }}
                  </p>
                </div>

                <div>
                  <label class="block font-medium mb-2">Apartment/Suite</label>
                  <input v-model="formData.apartment" type="text" class="input-field" placeholder="Apt 4B" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block font-medium mb-2">City *</label>
                    <input v-model="formData.city" type="text" class="input-field"
                      :class="{ 'border-red-500': errors.city }" placeholder="New York" />
                    <p v-if="errors.city" class="text-red-600 text-sm mt-1">{{ errors.city }}</p>
                  </div>

                  <div>
                    <label class="block font-medium mb-2">Zip Code *</label>
                    <input v-model="formData.zipCode" type="text" class="input-field"
                      :class="{ 'border-red-500': errors.zipCode }" placeholder="10001" maxlength="5" />
                    <p v-if="errors.zipCode" class="text-red-600 text-sm mt-1">
                      {{ errors.zipCode }}
                    </p>
                  </div>
                </div>

                <div>
                  <label class="block font-medium mb-2">Delivery Instructions</label>
                  <textarea v-model="formData.deliveryInstructions" class="input-field" rows="3"
                    placeholder="Ring doorbell, leave at door, etc."></textarea>
                </div>
              </div>
            </div>

            <div v-else>
              <h2 class="text-xl font-semibold mb-6">Pickup Time</h2>
              <div class="space-y-4">
                <div>
                  <label class="block font-medium mb-2">Pickup Date *</label>
                  <input v-model="formData.pickupDate" type="date" class="input-field" :min="minDate" />
                </div>

                <div>
                  <label class="block font-medium mb-2">Pickup Time *</label>
                  <select v-model="formData.pickupTime" class="input-field">
                    <option value="">Select time</option>
                    <option v-for="time in availableTimeSlots" :key="time" :value="time">
                      {{ time }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div v-if="currentStep === 3">
            <h2 class="text-xl font-semibold mb-6">Payment Method</h2>
            <div class="space-y-3">
              <label v-for="method in paymentMethods" :key="method.id" :class="[
                'flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all',
                formData.paymentMethod === method.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300',
              ]">
                <input type="radio" v-model="formData.paymentMethod" :value="method.id" class="w-5 h-5" />
                <div class="flex-1">
                  <div class="font-semibold">{{ method.name }}</div>
                  <div class="text-sm text-gray-600">{{ method.description }}</div>
                </div>
                <span class="text-2xl">{{ method.icon }}</span>
              </label>
            </div>
          </div>

          <div v-if="currentStep === 4">
            <h2 class="text-xl font-semibold mb-6">Review Your Order</h2>

            <div class="space-y-6">
              <div>
                <h3 class="font-semibold mb-2">Contact Information</h3>
                <p class="text-gray-600">{{ formData.name }}</p>
                <p class="text-gray-600">{{ formData.email }}</p>
                <p class="text-gray-600">{{ formData.phone }}</p>
              </div>

              <div>
                <h3 class="font-semibold mb-2">Order Type</h3>
                <p class="text-gray-600 capitalize">{{ formData.orderType }}</p>
              </div>

              <div v-if="formData.orderType === 'delivery'">
                <h3 class="font-semibold mb-2">Delivery Address</h3>
                <p class="text-gray-600">{{ formData.address }}</p>
                <p v-if="formData.apartment" class="text-gray-600">{{ formData.apartment }}</p>
                <p class="text-gray-600">{{ formData.city }}, {{ formData.zipCode }}</p>
              </div>
              <div v-else>
                <h3 class="font-semibold mb-2">Pickup Time</h3>
                <p class="text-gray-600">{{ formData.pickupDate }} at {{ formData.pickupTime }}</p>
              </div>

              <div>
                <h3 class="font-semibold mb-2">Payment Method</h3>
                <p class="text-gray-600">{{ getPaymentMethodName(formData.paymentMethod) }}</p>
              </div>
              <div>
                <h3 class="font-semibold mb-3">Order Items ({{ cartStore.itemCount }})</h3>
                <div class="space-y-2">
                  <div v-for="item in cartStore.cartItems" :key="item.cartItemId" class="flex justify-between text-sm">
                    <span>{{ item.quantity }}x {{ item.name }}</span>
                    <span class="font-semibold">{{
                      formatCurrency(item.basePrice * item.quantity)
                      }}</span>
                  </div>
                </div>
              </div>

              <div class="border-t pt-4">
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span>Subtotal</span>
                    <span>{{ formatCurrency(cartStore.subtotal) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Tax</span>
                    <span>{{ formatCurrency(cartStore.tax) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{{ formatCurrency(cartStore.deliveryFee) }}</span>
                  </div>
                  <div class="flex justify-between text-xl font-bold border-t pt-2">
                    <span>Total</span>
                    <span class="text-primary-600">{{ formatCurrency(cartStore.total) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between gap-4">
          <BaseButton v-if="currentStep > 0" variant="outline" @click="prevStep">
            ← Back
          </BaseButton>
          <div v-else></div>

          <BaseButton v-if="currentStep < steps.length - 1" variant="primary" @click="nextStep">
            Continue →
          </BaseButton>
          <BaseButton v-else variant="primary" @click="submitOrder" :loading="submitting" :disabled="submitting">
            {{ submitting ? 'Placing Order...' : 'Place Order' }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cartStore.js';
import { useOrderStore } from '@/stores/orderStore.js';
import { formatCurrency } from '@/utils/currency.js';
import { validateField } from '@/utils/validation.js';
import BaseButton from '@/components/common/BaseButton.vue';

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();

const steps = ['Contact', 'Order Type', 'Details', 'Payment', 'Review'];
const currentStep = ref(0);
const submitting = ref(false);
const errors = ref({});

const formData = ref({
  name: '',
  phone: '',
  email: '',
  orderType: 'delivery',
  address: '',
  apartment: '',
  city: '',
  zipCode: '',
  deliveryInstructions: '',
  pickupDate: '',
  pickupTime: '',
  paymentMethod: 'cash',
});

const paymentMethods = [
  {
    id: 'cash',
    name: 'Cash on Delivery',
  },
  { id: 'card', name: 'Credit/Debit Card' },
  {
    id: 'wallet',
    name: 'Digital Wallet',
  },
];

const minDate = computed(() => {
  return new Date().toISOString().split('T')[0];
});

const availableTimeSlots = computed(() => {
  const slots = [];
  for (let hour = 10; hour <= 21; hour++) {
    for (let min of [0, 30]) {
      const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      slots.push(time);
    }
  }
  return slots;
});

const validateStep = () => {
  errors.value = {};

  if (currentStep.value === 0) {
    errors.value.name = validateField('Name', formData.value.name, {
      required: true,
      minLength: 2,
    });
    errors.value.phone = validateField('Phone', formData.value.phone, {
      required: true,
      phone: true,
    });
    errors.value.email = validateField('Email', formData.value.email, {
      required: true,
      email: true,
    });
  } else if (currentStep.value === 2 && formData.value.orderType === 'delivery') {
    errors.value.address = validateField('Address', formData.value.address, {
      required: true,
      minLength: 5,
    });
    errors.value.city = validateField('City', formData.value.city, { required: true });
    errors.value.zipCode = validateField('Zip Code', formData.value.zipCode, {
      required: true,
      zipCode: true,
    });
  }

  return Object.values(errors.value).every((error) => !error);
};

const nextStep = () => {
  if (validateStep()) {
    currentStep.value++;
  }
};

const prevStep = () => {
  currentStep.value--;
};

const getPaymentMethodName = (id) => {
  return paymentMethods.find((m) => m.id === id)?.name || id;
};

const submitOrder = async () => {
  if (!validateStep()) return;

  submitting.value = true;

  try {
    const orderData = {
      items: cartStore.cartItems,
      customerInfo: {
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.phone,
      },
      orderType: formData.value.orderType,
      deliveryAddress:
        formData.value.orderType === 'delivery'
          ? {
            street: formData.value.address,
            apartment: formData.value.apartment,
            city: formData.value.city,
            zipCode: formData.value.zipCode,
            instructions: formData.value.deliveryInstructions,
          }
          : null,
      pickupTime:
        formData.value.orderType === 'pickup'
          ? `${formData.value.pickupDate}T${formData.value.pickupTime}:00`
          : null,
      paymentMethod: formData.value.paymentMethod,
      pricing: {
        subtotal: cartStore.subtotal,
        tax: cartStore.tax,
        deliveryFee: cartStore.deliveryFee,
        total: cartStore.total,
      },
    };

    const order = await orderStore.submitOrder(orderData);
    router.push(`/order-confirmation/${order.orderId}`);
  } catch (error) {
    alert('Error placing order: ' + error.message);
  } finally {
    submitting.value = false;
  }
};
</script>
